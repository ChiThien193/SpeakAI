from datetime import datetime, UTC


def build_notification_document(
    notification_id: str,
    user_firebase_uid: str,
    notification_type: str,
    title: str,
    message: str,
    data: dict | None = None,
) -> dict:
    now = datetime.now(UTC)

    return {
        "notification_id": notification_id,
        "user_firebase_uid": user_firebase_uid,
        "type": notification_type,
        "title": title,
        "message": message,
        "data": data or {},
        "is_read": False,
        "created_at": now,
        "updated_at": now,
    }