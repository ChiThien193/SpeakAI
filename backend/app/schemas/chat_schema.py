from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class FeedbackResponse(BaseModel):
    grammar_notes: list[str] = Field(default_factory=list)
    better_expressions: list[str] = Field(default_factory=list)
    clarity_hint: Optional[str] = None


class ChatTurnRequest(BaseModel):
    session_id: str = Field(..., min_length=2)
    text: str = Field(..., min_length=1)


class ChatTurnResponse(BaseModel):
    session_id: str
    scenario_id: str
    user_message_id: str
    assistant_message_id: str
    user_message: str
    reply: str
    provider: str
    feedback: FeedbackResponse


class MessageResponse(BaseModel):
    message_id: str
    session_id: str
    user_firebase_uid: str
    role: str
    text: str
    input_type: str
    provider: str
    feedback: Optional[FeedbackResponse] = None
    created_at: datetime


class SessionHistoryResponse(BaseModel):
    session_id: str
    total: int
    items: list[MessageResponse]