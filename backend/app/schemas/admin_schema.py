from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class AdminOverviewResponse(BaseModel):
    total_users: int
    learner_users: int
    admin_users: int
    active_scenarios: int
    total_sessions: int
    active_sessions: int
    ended_sessions: int
    total_messages: int
    total_audio_messages: int
    total_feedbacks: int
    average_feedback_rating: float
    total_reports: int
    open_reports: int
    unread_notifications: int


class AdminScenarioAnalyticsItemResponse(BaseModel):
    scenario_id: str
    title: str
    level: str
    category: str
    sessions_count: int
    active_sessions_count: int
    ended_sessions_count: int
    total_messages: int
    total_user_messages: int
    total_audio_messages: int
    average_feedback_rating: float
    last_session_at: Optional[datetime] = None


class AdminScenarioAnalyticsListResponse(BaseModel):
    items: list[AdminScenarioAnalyticsItemResponse]
    total: int


class AdminReportItemResponse(BaseModel):
    report_id: str
    session_id: str
    assistant_message_id: str
    user_firebase_uid: str
    report_type: str
    reason: str
    note: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    admin_note: Optional[str] = None


class AdminReportListResponse(BaseModel):
    items: list[AdminReportItemResponse]
    total: int


class AdminUpdateReportStatusRequest(BaseModel):
    status: str = Field(..., min_length=2)
    admin_note: Optional[str] = None