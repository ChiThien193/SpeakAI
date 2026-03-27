from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class NotificationResponse(BaseModel):
    notification_id: str
    type: str
    title: str
    message: str
    data: Optional[dict] = None
    is_read: bool
    created_at: datetime


class NotificationListResponse(BaseModel):
    items: list[NotificationResponse]
    total: int
    unread_count: int


class MarkAllNotificationsReadResponse(BaseModel):
    message: str
    modified_count: int