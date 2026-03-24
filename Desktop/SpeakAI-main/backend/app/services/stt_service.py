import httpx
import os
import tempfile
from typing import Dict, Any
from pydub import AudioSegment
from app.core.config import settings

# Cấu hình ffmpeg: ưu tiên path do bạn set, nếu không có thì dùng path hệ thống
FFMPEG_PATH = r"C:\Users\grill\AppData\Local\Microsoft\WinGet\Links\ffmpeg.exe"
FFPROBE_PATH = r"C:\Users\grill\AppData\Local\Microsoft\WinGet\Links\ffprobe.exe"

if os.path.exists(FFMPEG_PATH):
    AudioSegment.converter = FFMPEG_PATH
    AudioSegment.ffmpeg = FFMPEG_PATH

if os.path.exists(FFPROBE_PATH):
    AudioSegment.ffprobe = FFPROBE_PATH


class STTService:
    def __init__(self):
        self.openai_url = f"{settings.OPENAI_BASE_URL}/audio/transcriptions"
        self.groq_url = f"{settings.GROQ_BASE_URL}/audio/transcriptions"

    def convert_to_wav(self, input_bytes: bytes, input_format: str = "webm") -> str:
        """
        Chuyển audio đầu vào sang wav để tăng độ ổn định khi gọi STT API.
        """
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{input_format}") as temp_input:
            temp_input.write(input_bytes)
            input_path = temp_input.name

        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_output:
            output_path = temp_output.name

        try:
            audio = AudioSegment.from_file(input_path, format=input_format)
            audio.export(output_path, format="wav")
            return output_path
        finally:
            if os.path.exists(input_path):
                os.remove(input_path)

    def _resolve_provider_config(self, provider: str) -> Dict[str, Any]:
        provider = (provider or "").lower().strip()

        if provider == "openai":
            return {
                "provider": "openai",
                "url": self.openai_url,
                "api_key": settings.OPENAI_API_KEY,
                "model": settings.STT_MODEL,
            }

        if provider == "groq":
            return {
                "provider": "groq",
                "url": self.groq_url,
                "api_key": settings.GROQ_API_KEY,
                "model": settings.GROQ_STT_MODEL,
            }

        return {
            "provider": provider,
            "url": None,
            "api_key": None,
            "model": None,
        }

    async def _call_transcription_api(
        self,
        provider: str,
        wav_path: str,
        language: str = "en"
    ) -> Dict[str, Any]:
        cfg = self._resolve_provider_config(provider)

        if not cfg["url"]:
            return {
                "success": False,
                "text": None,
                "error": f"Unsupported STT provider: {provider}",
                "provider": provider,
                "status_code": None,
            }

        if not cfg["api_key"]:
            return {
                "success": False,
                "text": None,
                "error": f"Missing API key for provider: {provider}",
                "provider": provider,
                "status_code": None,
            }

        if not cfg["model"]:
            return {
                "success": False,
                "text": None,
                "error": f"Missing STT model for provider: {provider}",
                "provider": provider,
                "status_code": None,
            }

        headers = {
            "Authorization": f"Bearer {cfg['api_key']}"
        }

        try:
            async with httpx.AsyncClient(
                timeout=settings.REQUEST_TIMEOUT,
                follow_redirects=True,
                trust_env=False
            ) as client:
                with open(wav_path, "rb") as f:
                    files = {
                        "file": ("audio.wav", f, "audio/wav")
                    }
                    data = {
                        "model": cfg["model"],
                        "language": language
                    }

                    response = await client.post(
                        cfg["url"],
                        headers=headers,
                        data=data,
                        files=files
                    )

            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "text": result.get("text"),
                    "error": None,
                    "provider": cfg["provider"],
                    "status_code": 200,
                }

            return {
                "success": False,
                "text": None,
                "error": response.text,
                "provider": cfg["provider"],
                "status_code": response.status_code,
            }

        except Exception as e:
            return {
                "success": False,
                "text": None,
                "error": f"{type(e).__name__}: {str(e)}",
                "provider": cfg["provider"],
                "status_code": None,
            }

    async def transcribe(
        self,
        audio_data: bytes,
        filename: str = "audio.webm",
        content_type: str = "audio/webm",
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Nhận audio bytes, convert sang wav, gọi STT provider chính.
        Nếu provider chính hết quota hoặc lỗi quota-related thì fallback sang provider dự phòng.
        """
        wav_path = None

        try:
            ext = os.path.splitext(filename)[1].lower()
            input_format = ext.replace(".", "") if ext else "webm"

            # Log nhẹ để debug khi cần
            print("STT filename:", filename)
            print("STT content_type:", content_type)
            print("STT input_format:", input_format)

            wav_path = self.convert_to_wav(audio_data, input_format=input_format)

            primary = (settings.STT_PROVIDER or "openai").lower().strip()
            fallback = (settings.STT_FALLBACK_PROVIDER or "").lower().strip()

            primary_result = await self._call_transcription_api(
                provider=primary,
                wav_path=wav_path,
                language=language
            )

            print("STT primary provider:", primary_result.get("provider"))
            print("STT primary status:", primary_result.get("status_code"))

            if primary_result["success"]:
                return primary_result

            error_text = (primary_result.get("error") or "").lower()
            should_fallback = (
                primary_result.get("status_code") == 429
                or "insufficient_quota" in error_text
                or "quota" in error_text
                or "rate_limit" in error_text
            )

            if should_fallback and fallback and fallback != primary:
                fallback_result = await self._call_transcription_api(
                    provider=fallback,
                    wav_path=wav_path,
                    language=language
                )

                print("STT fallback provider:", fallback_result.get("provider"))
                print("STT fallback status:", fallback_result.get("status_code"))

                if fallback_result["success"]:
                    return fallback_result

                return {
                    "success": False,
                    "text": None,
                    "error": (
                        f"Primary STT failed ({primary}): {primary_result['error']} | "
                        f"Fallback STT failed ({fallback}): {fallback_result['error']}"
                    ),
                    "provider": fallback,
                    "status_code": fallback_result.get("status_code"),
                }

            return primary_result

        except Exception as e:
            return {
                "success": False,
                "text": None,
                "error": f"{type(e).__name__}: {str(e)}",
                "provider": settings.STT_PROVIDER,
                "status_code": None,
            }

        finally:
            if wav_path and os.path.exists(wav_path):
                os.remove(wav_path)


stt_service = STTService()