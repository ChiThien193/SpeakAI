from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class ProgressSummaryResponse(BaseModel):
    total_sessions: int
    active_sessions: int
    ended_sessions: int
    practiced_scenarios_count: int
    practiced_scenarios: list[str]
    total_user_messages: int
    total_text_messages: int
    total_audio_messages: int
    submitted_feedbacks: int
    average_feedback_rating: float
    reports_submitted: int
    unread_notifications: int
    last_activity_at: Optional[datetime] = None


class ScenarioProgressItemResponse(BaseModel):
    scenario_id: str
    title: str
    level: str
    category: str
    sessions_count: int
    ended_sessions_count: int
    total_user_messages: int
    total_audio_messages: int
    last_practiced_at: Optional[datetime] = None


class ScenarioProgressListResponse(BaseModel):
    items: list[ScenarioProgressItemResponse]
    total: int