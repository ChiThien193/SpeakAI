import json
from typing import Dict, Any
from app.services.llm_service import llm_service


class SpeakingEvaluationService:
    async def evaluate_transcript(
        self,
        transcript: str,
        scenario: str = "general"
    ) -> Dict[str, Any]:
        """
        Dùng LLM để đánh giá transcript từ giọng nói người học.
        """

        if not transcript or not transcript.strip():
            return {
                "success": False,
                "error": "Empty transcript",
                "analysis": None
            }

        system_prompt = """
You are an English speaking evaluation assistant for Vietnamese learners.

Your job:
- Evaluate the learner's spoken English based only on the transcript.
- Do NOT assume a fixed target sentence.
- Focus on clarity, naturalness, grammar, and usefulness in conversation.
- Give simple, supportive feedback.
- Return ONLY valid JSON.

Required JSON format:
{
  "clarity_score": 0,
  "grammar_score": 0,
  "naturalness_score": 0,
  "overall_score": 0,
  "detected_level": "",
  "strengths": [],
  "issues": [],
  "improved_sentence": "",
  "short_feedback": "",
  "advice": []
}

Rules:
- Scores must be integers from 0 to 100.
- strengths, issues, advice must be arrays of short strings.
- improved_sentence must be a more natural version of the learner's sentence.
- short_feedback must be brief and encouraging.
"""

        user_prompt = f"""
Scenario: {scenario}

Learner transcript:
{transcript}

Evaluate this learner's spoken English from the transcript only.
Return JSON only.
"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        llm_result = await llm_service.generate(messages, temperature=0.2, max_tokens=500)

        if not llm_result["success"]:
            return {
                "success": False,
                "error": llm_result["error"],
                "analysis": None
            }

        raw_text = llm_result["message"]

        try:
            analysis = json.loads(raw_text)
            return {
                "success": True,
                "error": None,
                "analysis": analysis
            }
        except Exception:
            return {
                "success": False,
                "error": f"Failed to parse evaluation JSON: {raw_text}",
                "analysis": None
            }


speaking_evaluation_service = SpeakingEvaluationService()