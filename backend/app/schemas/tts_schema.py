from pydantic import BaseModel, Field
from typing import Optional


class TtsRequest(BaseModel):
    text: str = Field(..., min_length=1)
    voice: Optional[str] = None
    rate: Optional[str] = None
    volume: Optional[str] = None
    pitch: Optional[str] = None
    filename_prefix: Optional[str] = None


class VoiceOptionResponse(BaseModel):
    short_name: str
    locale: str
    gender: Optional[str] = None
    friendly_name: Optional[str] = None


class VoiceListResponse(BaseModel):
    items: list[VoiceOptionResponse]
    total: int