from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SessionCreateRequest(BaseModel):
    scenario_id: str = Field(..., min_length=2)
    mode: str = Field(default="rag")


class SessionResponse(BaseModel):
    session_id: str
    user_firebase_uid: str
    scenario_id: str
    mode: str
    status: str
    started_at: datetime
    ended_at: Optional[datetime] = None


class SessionListResponse(BaseModel):
    items: list[SessionResponse]
    total: int