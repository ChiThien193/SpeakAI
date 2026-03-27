import asyncio
from pathlib import Path
from fastapi import UploadFile

from app.core.config import settings
from app.core.exceptions import BadRequestException
from app.clients.groq_client import GroqClient


ALLOWED_AUDIO_EXTENSIONS = {
    ".flac", ".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".ogg", ".wav", ".webm"
}

ALLOWED_AUDIO_CONTENT_TYPES = {
    "audio/flac",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/mpga",
    "audio/m4a",
    "audio/ogg",
    "audio/wav",
    "audio/webm",
    "video/mp4",
    "application/octet-stream",
}


class SpeechService:
    def __init__(self):
        self.groq_client = GroqClient()

    async def transcribe_upload(
        self,
        audio: UploadFile,
        language: str | None = None,
        prompt: str | None = None,
    ) -> dict:
        self._validate_audio_file(audio)

        file_bytes = await audio.read()

        if not file_bytes:
            raise BadRequestException("Audio file is empty")

        if len(file_bytes) > settings.max_audio_upload_bytes:
            raise BadRequestException(
                f"Audio file is too large. Max allowed is {settings.max_audio_upload_bytes} bytes."
            )

        filename = audio.filename or "audio.wav"
        content_type = audio.content_type

        raw_result = await asyncio.to_thread(
            self.groq_client.transcribe_audio,
            filename,
            file_bytes,
            language,
            prompt,
        )

        normalized = self._normalize_transcription_result(
            raw_result=raw_result,
            filename=filename,
            content_type=content_type,
            requested_language=language or settings.stt_language,
        )

        return normalized

    def _validate_audio_file(self, audio: UploadFile) -> None:
        filename = audio.filename or ""
        suffix = Path(filename).suffix.lower()

        if suffix not in ALLOWED_AUDIO_EXTENSIONS:
            raise BadRequestException(
                "Unsupported audio format. Allowed: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm."
            )

        if audio.content_type and audio.content_type not in ALLOWED_AUDIO_CONTENT_TYPES:
            raise BadRequestException(
                f"Unsupported content type: {audio.content_type}"
            )

    def _normalize_transcription_result(
        self,
        raw_result: dict,
        filename: str,
        content_type: str | None,
        requested_language: str | None,
    ) -> dict:
        transcript = str(raw_result.get("text", "")).strip()

        if not transcript:
            raise BadRequestException("Transcription returned empty text")

        raw_segments = raw_result.get("segments", []) or []

        segments: list[dict] = []
        low_confidence_segments = 0
        likely_non_speech_segments = 0

        for seg in raw_segments:
            avg_logprob = seg.get("avg_logprob")
            no_speech_prob = seg.get("no_speech_prob")
            compression_ratio = seg.get("compression_ratio")

            if avg_logprob is not None and avg_logprob <= -0.5:
                low_confidence_segments += 1

            if no_speech_prob is not None and no_speech_prob >= 0.6:
                likely_non_speech_segments += 1

            segments.append(
                {
                    "id": seg.get("id"),
                    "start": seg.get("start"),
                    "end": seg.get("end"),
                    "text": str(seg.get("text", "")).strip(),
                    "avg_logprob": avg_logprob,
                    "compression_ratio": compression_ratio,
                    "no_speech_prob": no_speech_prob,
                }
            )

        quality_hint = None
        if low_confidence_segments > 0:
            quality_hint = "Some segments look low-confidence. Try clearer speech or less background noise."
        elif likely_non_speech_segments > 0:
            quality_hint = "Some segments may contain silence or non-speech audio."
        elif not raw_segments:
            quality_hint = "No segment metadata returned; transcript text is still available."

        return {
            "filename": filename,
            "content_type": content_type,
            "model": settings.stt_model,
            "language": raw_result.get("language") or requested_language,
            "transcript": transcript,
            "segments_count": len(segments),
            "low_confidence_segments": low_confidence_segments,
            "likely_non_speech_segments": likely_non_speech_segments,
            "quality_hint": quality_hint,
            "segments": segments,
        }