import httpx
from typing import Dict, Any, Optional
from app.core.config import settings


class BaseTTSProvider:
    async def synthesize(self, text: str) -> Dict[str, Any]:
        raise NotImplementedError


class OpenAITTSProvider(BaseTTSProvider):
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.url = f"{settings.OPENAI_BASE_URL}/audio/speech"

    async def synthesize(self, text: str) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=max(settings.REQUEST_TIMEOUT, 30.0), follow_redirects=True, trust_env=False) as client:
                response = await client.post(
                    self.url,
                    json={
                        "model": settings.TTS_MODEL,
                        "voice": settings.TTS_VOICE,
                        "input": text,
                    },
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                )

            if response.status_code == 200:
                return {"success": True, "audio": response.content, "provider": "openai", "error": None}

            print(f"TTS error: {response.status_code} - {response.text}")
            return {"success": False, "audio": None, "provider": "openai", "error": f"TTS error {response.status_code}: {response.text}"}
        except Exception as e:
            print(f"TTS exception: {e}")
            return {"success": False, "audio": None, "provider": "openai", "error": f"TTS exception: {str(e)}"}


class TTSService:
    def __init__(self):
        provider_name = settings.TTS_PROVIDER.lower()
        if provider_name == "openai":
            self.provider = OpenAITTSProvider()
        else:
            raise ValueError(f"Unsupported TTS_PROVIDER: {settings.TTS_PROVIDER}")

    async def synthesize(self, text: str) -> Dict[str, Any]:
        return await self.provider.synthesize(text)


tts_service = TTSService()
