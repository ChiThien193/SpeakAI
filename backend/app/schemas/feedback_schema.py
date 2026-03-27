from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class SessionFeedbackRequest(BaseModel):
    session_id: str = Field(..., min_length=2)
    rating: int = Field(..., ge=1, le=5)
    usefulness_rating: Optional[int] = Field(default=None, ge=1, le=5)
    speaking_confidence: Optional[int] = Field(default=None, ge=1, le=5)
    difficulty: Optional[str] = None
    comment: Optional[str] = None


class SessionFeedbackResponse(BaseModel):
    feedback_id: str
    session_id: str
    scenario_id: str
    user_firebase_uid: str
    rating: int
    usefulness_rating: Optional[int] = None
    speaking_confidence: Optional[int] = None
    difficulty: Optional[str] = None
    comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime