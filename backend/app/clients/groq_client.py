from groq import Groq
from app.core.config import settings


STRICT_JSON_MODELS = {
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
}


class GroqClient:
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)

    def generate_chat_turn(self, system_prompt: str, user_prompt: str) -> str:
        strict_mode = settings.groq_model in STRICT_JSON_MODELS

        response = self.client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            temperature=settings.groq_temperature,
            max_completion_tokens=settings.groq_max_completion_tokens,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "speakai_chat_turn_response",
                    "strict": strict_mode,
                    "schema": self._get_chat_turn_schema(),
                },
            },
        )

        content = response.choices[0].message.content
        if not content:
            raise ValueError("Empty content returned from Groq")

        return content

    def transcribe_audio(
        self,
        filename: str,
        file_bytes: bytes,
        language: str | None = None,
        prompt: str | None = None,
    ) -> dict:
        transcription = self.client.audio.transcriptions.create(
            file=(filename, file_bytes),
            model=settings.stt_model,
            language=language or settings.stt_language,
            prompt=prompt,
            response_format="verbose_json",
            temperature=settings.stt_temperature,
            timestamp_granularities=["segment"],
        )

        if hasattr(transcription, "model_dump"):
            return transcription.model_dump()

        if isinstance(transcription, dict):
            return transcription

        return dict(transcription)

    def _get_chat_turn_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "reply": {
                    "type": "string"
                },
                "feedback": {
                    "type": "object",
                    "properties": {
                        "grammar_notes": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "better_expressions": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "clarity_hint": {
                            "type": ["string", "null"]
                        }
                    },
                    "required": [
                        "grammar_notes",
                        "better_expressions",
                        "clarity_hint"
                    ],
                    "additionalProperties": False
                }
            },
            "required": ["reply", "feedback"],
            "additionalProperties": False
        }