import httpx
from typing import Dict, List
from app.core.config import settings


class BaseLLMProvider:
    async def generate(self, messages: List[Dict[str, str]], temperature: float = 0.7, max_tokens: int = 500) -> Dict:
        raise NotImplementedError


class GroqLLMProvider(BaseLLMProvider):
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.LLM_MODEL
        self.url = f"{settings.GROQ_BASE_URL}/chat/completions"
        self.system_prompt = """
You are SpeakAI, an AI English speaking tutor for Vietnamese learners.

Your responsibilities:
- Help users practice spoken English by topic.
- Reply naturally, clearly, and briefly.
- Correct grammar and awkward phrasing gently.
- Encourage the learner with supportive feedback.
- Keep the conversation suitable for English speaking practice.
- If the user makes mistakes, provide a corrected version.
- Prefer simple English that learners can understand.
- Ask one short follow-up question when appropriate.
""".strip()

    def build_messages(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        return [{"role": "system", "content": self.system_prompt}, *messages]

    async def generate(self, messages: List[Dict[str, str]], temperature: float = 0.7, max_tokens: int = 500) -> Dict:
        final_messages = self.build_messages(messages)
        try:
            async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT, follow_redirects=True, trust_env=False) as client:
                response = await client.post(
                    self.url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.model,
                        "messages": final_messages,
                        "temperature": temperature,
                        "max_tokens": max_tokens,
                    },
                )

            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "message": result["choices"][0]["message"]["content"],
                    "usage": result.get("usage", {}),
                    "provider": "groq",
                }

            return {
                "success": False,
                "error": f"LLM error {response.status_code}: {response.text}",
                "message": None,
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"LLM exception: {str(e)}",
                "message": None,
            }


class LLMService:
    def __init__(self):
        provider_name = settings.LLM_PROVIDER.lower()
        if provider_name == "groq":
            self.provider = GroqLLMProvider()
        else:
            raise ValueError(f"Unsupported LLM_PROVIDER: {settings.LLM_PROVIDER}")

    async def generate(self, messages: List[Dict[str, str]], temperature: float = 0.7, max_tokens: int = 500) -> Dict:
        return await self.provider.generate(messages, temperature=temperature, max_tokens=max_tokens)


llm_service = LLMService()
