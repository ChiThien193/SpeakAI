import asyncio
import uuid
from app.core.config import settings
from app.core.exceptions import BadRequestException
from app.repositories.message_repo import MessageRepository
from app.services.session_service import SessionService
from app.services.scenario_service import ScenarioService
from app.services.prompt_builder import PromptBuilder
from app.services.llm_parser import parse_chat_turn_llm_output
from app.clients.groq_client import GroqClient
from app.services.rag_service import RagService


class ChatService:
    def __init__(self):
        self.message_repo = MessageRepository()
        self.session_service = SessionService()
        self.scenario_service = ScenarioService()
        self.prompt_builder = PromptBuilder()
        self.groq_client = GroqClient()
        self.rag_service = RagService()

    async def process_text_turn(
        self,
        user_firebase_uid: str,
        session_id: str,
        text: str,
        input_type: str = "text",
        input_metadata: dict | None = None,
    ) -> dict:
        clean_text = text.strip()

        if not clean_text:
            raise BadRequestException("Text cannot be empty")

        session = await self.session_service.get_session_by_id(
            session_id=session_id,
            user_firebase_uid=user_firebase_uid,
        )

        if session["status"] != "active":
            raise BadRequestException("Session is not active")

        scenario = await self.scenario_service.get_scenario_by_id(session["scenario_id"])

        recent_messages = await self.message_repo.find_recent_by_session_id(
            session_id=session_id,
            limit=settings.max_chat_history_messages,
        )

        user_message_id = str(uuid.uuid4())
        assistant_message_id = str(uuid.uuid4())

        user_message_metadata = {
            "mode": session["mode"],
            "scenario_id": scenario["scenario_id"],
        }

        if input_metadata:
            user_message_metadata.update(input_metadata)

        user_message = await self.message_repo.create_message(
            message_id=user_message_id,
            session_id=session_id,
            user_firebase_uid=user_firebase_uid,
            role="user",
            text=clean_text,
            input_type=input_type,
            provider="client",
            feedback=None,
            metadata=user_message_metadata,
        )

        rag_chunks: list[dict] = []
        if session["mode"] == "rag":
            rag_chunks = await self.rag_service.retrieve(
                scenario_id=scenario["scenario_id"],
                query_text=clean_text,
                top_k=settings.rag_top_k,
            )

        system_prompt = self.prompt_builder.build_system_prompt(scenario)
        user_prompt = self.prompt_builder.build_user_prompt(
            scenario=scenario,
            history_messages=recent_messages,
            current_user_text=clean_text,
            rag_chunks=rag_chunks,
        )

        provider = f"groq:{settings.groq_model}"

        try:
            raw_content = await asyncio.to_thread(
                self.groq_client.generate_chat_turn,
                system_prompt,
                user_prompt,
            )

            llm_result = parse_chat_turn_llm_output(raw_content)
            reply = llm_result["reply"]
            feedback = llm_result["feedback"]

        except Exception:
            provider = "fallback-mock-assistant"
            reply = self._generate_mock_reply(
                scenario_id=scenario["scenario_id"],
                user_text=clean_text,
            )
            feedback = self._generate_feedback(clean_text)

        assistant_message = await self.message_repo.create_message(
            message_id=assistant_message_id,
            session_id=session_id,
            user_firebase_uid=user_firebase_uid,
            role="assistant",
            text=reply,
            input_type="text",
            provider=provider,
            feedback=feedback,
            metadata={
                "mode": session["mode"],
                "scenario_id": scenario["scenario_id"],
                "rag_sources": [
                    {
                        "chunk_id": item["chunk_id"],
                        "source_file": item["metadata"].get("source_file"),
                        "distance": item["distance"],
                    }
                    for item in rag_chunks
                ],
            },
        )

        return {
            "session_id": session["session_id"],
            "scenario_id": scenario["scenario_id"],
            "user_message_id": user_message["message_id"],
            "assistant_message_id": assistant_message["message_id"],
            "user_message": user_message["text"],
            "reply": assistant_message["text"],
            "provider": assistant_message["provider"],
            "feedback": assistant_message["feedback"],
        }

    async def get_session_history(
        self,
        user_firebase_uid: str,
        session_id: str,
    ) -> dict:
        session = await self.session_service.get_session_by_id(
            session_id=session_id,
            user_firebase_uid=user_firebase_uid,
        )

        messages = await self.message_repo.find_by_session_id(session["session_id"])

        return {
            "session_id": session["session_id"],
            "total": len(messages),
            "items": messages,
        }

    def _generate_mock_reply(self, scenario_id: str, user_text: str) -> str:
        lower_text = user_text.lower()

        if scenario_id == "restaurant_basic":
            if "menu" in lower_text:
                return "Of course. Here is the menu. What would you like to order?"
            if "bill" in lower_text or "check" in lower_text:
                return "Certainly. Would you like to pay by cash or card?"
            if "drink" in lower_text:
                return "Sure. What would you like to drink?"
            return "Sure. What would you like to eat or drink?"

        if scenario_id == "job_interview_basic":
            if "my name is" in lower_text or "i am" in lower_text:
                return "Nice to meet you. Could you tell me about your strengths?"
            if "experience" in lower_text:
                return "That sounds good. Could you share one achievement?"
            if "strength" in lower_text or "skill" in lower_text:
                return "Great. How would that help in this position?"
            return "Thanks. Could you tell me a little about yourself?"

        if scenario_id == "travel_airport_basic":
            if "passport" in lower_text:
                return "Thank you. Do you also have your boarding pass?"
            if "gate" in lower_text:
                return "Your gate is A12. Boarding starts in thirty minutes."
            if "check in" in lower_text or "check-in" in lower_text:
                return "Sure. May I see your passport and ticket, please?"
            return "Certainly. How can I help you at the airport today?"

        return "Great. Can you tell me a little more."

    def _generate_feedback(self, user_text: str) -> dict:
        lower_text = user_text.strip().lower()
        grammar_notes: list[str] = []
        better_expressions: list[str] = []
        clarity_hint = None

        if lower_text.startswith("i want"):
            grammar_notes.append("Use 'I'd like...' instead of 'I want...' to sound more polite.")
            better_expressions.append(user_text.replace("I want", "I'd like", 1))

        if lower_text.startswith("give me"):
            grammar_notes.append("Use 'Could I have...' instead of 'Give me...' to sound more natural.")
            tail = user_text[7:].strip()
            if tail:
                better_expressions.append(f"Could I have {tail}?")

        if len(user_text.split()) < 3:
            clarity_hint = "Try a longer sentence with a clear subject and request."

        if not user_text.endswith((".", "?", "!")):
            clarity_hint = clarity_hint or "Add punctuation to make your sentence clearer."

        return {
            "grammar_notes": grammar_notes,
            "better_expressions": better_expressions,
            "clarity_hint": clarity_hint,
        }