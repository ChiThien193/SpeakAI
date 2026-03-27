from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class AiResponseReportRequest(BaseModel):
    session_id: str = Field(..., min_length=2)
    assistant_message_id: str = Field(..., min_length=2)
    report_type: str = Field(..., min_length=2)
    reason: str = Field(..., min_length=2)
    note: Optional[str] = None


class AiResponseReportResponse(BaseModel):
    report_id: str
    session_id: str
    assistant_message_id: str
    user_firebase_uid: str
    report_type: str
    reason: str
    note: Optional[str] = None
    status: str
    created_at: datetime