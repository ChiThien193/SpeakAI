import json
from app.services.llm_service import llm_service
from app.services.rag_service import rag_service


class LearningFeedbackService:
    async def generate_feedback(self, transcript: str, scenario: str = "general"):
        """
        Sinh feedback học nói dựa trên transcript + tri thức từ RAG.
        """

        query = f"{scenario} speaking feedback for learner transcript: {transcript}"
        rag_results = rag_service.search("learning_feedback", query, n_results=5)
        rag_context = "\n".join(rag_results) if rag_results else ""

        system_prompt = """
You are a speaking feedback assistant for English learners.

Use the learner transcript and retrieved teaching knowledge to generate structured feedback.

Return ONLY valid JSON in this exact format:
{
  "learning_feedback": {
    "pronunciation_score": 0,
    "grammar": {
      "original": "",
      "issue": "",
      "suggested": ""
    },
    "expression": {
      "original": "",
      "better": ""
    },
    "pronunciation": {
      "issue_word": "",
      "feedback": ""
    }
  }
}

Rules:
- pronunciation_score must be an integer from 0 to 100
- Keep feedback short, useful, and supportive
- If there is no obvious grammar issue, still provide a mild improvement
- If there is no obvious pronunciation issue, choose the least clear word and give a gentle suggestion
"""

        user_prompt = f"""
Scenario: {scenario}

Learner transcript:
{transcript}

Retrieved feedback knowledge:
{rag_context}

Generate a learning feedback JSON now.
"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        result = await llm_service.generate(messages, temperature=0.2, max_tokens=500)

        if not result["success"]:
            return {
                "success": False,
                "error": result["error"],
                "feedback": None
            }

        try:
            parsed = json.loads(result["message"])
            return {
                "success": True,
                "error": None,
                "feedback": parsed
            }
        except Exception:
            return {
                "success": False,
                "error": f"Invalid JSON from LLM: {result['message']}",
                "feedback": None
            }


learning_feedback_service = LearningFeedbackService()