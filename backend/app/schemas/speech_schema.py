from pydantic import BaseModel
from typing import Optional

from app.schemas.chat_schema import ChatTurnResponse


class TranscriptionSegmentResponse(BaseModel):
    id: Optional[int] = None
    start: Optional[float] = None
    end: Optional[float] = None
    text: str
    avg_logprob: Optional[float] = None
    compression_ratio: Optional[float] = None
    no_speech_prob: Optional[float] = None


class SpeechTranscriptionResponse(BaseModel):
    filename: str
    content_type: Optional[str] = None
    model: str
    language: Optional[str] = None
    transcript: str
    segments_count: int
    low_confidence_segments: int
    likely_non_speech_segments: int
    quality_hint: Optional[str] = None
    segments: list[TranscriptionSegmentResponse]


class VoiceTurnResponse(BaseModel):
    session_id: str
    transcription: SpeechTranscriptionResponse
    chat: ChatTurnResponse