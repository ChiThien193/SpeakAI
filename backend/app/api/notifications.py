from fastapi import APIRouter, Depends, Query
from app.api_deps import get_current_user
from app.schemas.notification_schema import (
    NotificationResponse,
    NotificationListResponse,
    MarkAllNotificationsReadResponse,
)
from app.services.notification_service import NotificationService

router = APIRouter()


@router.get("", response_model=NotificationListResponse)
async def get_notifications(
    only_unread: bool = Query(default=False),
    limit: int = Query(default=50, ge=1, le=200),
    current_user: dict = Depends(get_current_user),
):
    notification_service = NotificationService()
    result = await notification_service.get_notifications(
        user_firebase_uid=current_user["uid"],
        only_unread=only_unread,
        limit=limit,
    )

    return {
        "items": [
            {
                "notification_id": item["notification_id"],
                "type": item["type"],
                "title": item["title"],
                "message": item["message"],
                "data": item.get("data"),
                "is_read": item["is_read"],
                "created_at": item["created_at"],
            }
            for item in result["items"]
        ],
        "total": result["total"],
        "unread_count": result["unread_count"],
    }


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
):
    notification_service = NotificationService()
    item = await notification_service.mark_as_read(
        notification_id=notification_id,
        user_firebase_uid=current_user["uid"],
    )

    return {
        "notification_id": item["notification_id"],
        "type": item["type"],
        "title": item["title"],
        "message": item["message"],
        "data": item.get("data"),
        "is_read": item["is_read"],
        "created_at": item["created_at"],
    }


@router.patch("/read-all", response_model=MarkAllNotificationsReadResponse)
async def mark_all_notifications_as_read(
    current_user: dict = Depends(get_current_user),
):
    notification_service = NotificationService()
    modified_count = await notification_service.mark_all_as_read(current_user["uid"])

    return {
        "message": "All notifications marked as read",
        "modified_count": modified_count,
    }