import os
import re
import uuid
from pathlib import Path

import edge_tts

from app.core.config import settings
from app.core.exceptions import BadRequestException


RATE_PATTERN = re.compile(r"^[+-]\d+%$")
VOLUME_PATTERN = re.compile(r"^[+-]\d+%$")
PITCH_PATTERN = re.compile(r"^[+-]\d+Hz$")


class TtsService:
    def __init__(self):
        self.output_dir = Path(settings.tts_output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    async def list_voices(self, locale: str | None = None) -> list[dict]:
        voices = await edge_tts.list_voices()

        items: list[dict] = []
        for voice in voices:
            short_name = voice.get("ShortName")
            voice_locale = voice.get("Locale")

            if not short_name or not voice_locale:
                continue

            if locale and not voice_locale.lower().startswith(locale.lower()):
                continue

            items.append(
                {
                    "short_name": short_name,
                    "locale": voice_locale,
                    "gender": voice.get("Gender"),
                    "friendly_name": voice.get("FriendlyName"),
                }
            )

        items.sort(key=lambda x: (x["locale"], x["short_name"]))
        return items

    async def synthesize_to_file(
        self,
        text: str,
        voice: str | None = None,
        rate: str | None = None,
        volume: str | None = None,
        pitch: str | None = None,
        filename_prefix: str | None = None,
    ) -> dict:
        clean_text = text.strip()
        if not clean_text:
            raise BadRequestException("Text cannot be empty")

        if len(clean_text) > settings.tts_max_text_length:
            raise BadRequestException(
                f"Text is too long. Max allowed length is {settings.tts_max_text_length} characters."
            )

        final_voice = voice or settings.tts_voice
        final_rate = rate or settings.tts_rate
        final_volume = volume or settings.tts_volume
        final_pitch = pitch or settings.tts_pitch

        self._validate_prosody(final_rate, final_volume, final_pitch)

        safe_prefix = self._make_safe_prefix(filename_prefix or "tts")
        filename = f"{safe_prefix}_{uuid.uuid4().hex}.mp3"
        file_path = self.output_dir / filename

        communicator = edge_tts.Communicate(
            text=clean_text,
            voice=final_voice,
            rate=final_rate,
            volume=final_volume,
            pitch=final_pitch,
        )

        await communicator.save(str(file_path))

        return {
            "file_path": str(file_path),
            "filename": filename,
            "voice": final_voice,
            "rate": final_rate,
            "volume": final_volume,
            "pitch": final_pitch,
            "text_length": len(clean_text),
        }

    def delete_file_safely(self, file_path: str) -> None:
        try:
            if file_path and os.path.exists(file_path):
                os.remove(file_path)
        except Exception:
            pass

    def _validate_prosody(self, rate: str, volume: str, pitch: str) -> None:
        if not RATE_PATTERN.match(rate):
            raise BadRequestException("Invalid rate format. Example: +0%, -20%, +15%")

        if not VOLUME_PATTERN.match(volume):
            raise BadRequestException("Invalid volume format. Example: +0%, -20%, +10%")

        if not PITCH_PATTERN.match(pitch):
            raise BadRequestException("Invalid pitch format. Example: +0Hz, -10Hz, +20Hz")

    def _make_safe_prefix(self, value: str) -> str:
        value = value.strip().lower()
        value = re.sub(r"[^a-zA-Z0-9_-]+", "_", value)
        return value[:40] or "tts"