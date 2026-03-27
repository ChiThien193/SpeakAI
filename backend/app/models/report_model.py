from datetime import datetime, UTC


def build_ai_report_document(
    report_id: str,
    session_id: str,
    assistant_message_id: str,
    user_firebase_uid: str,
    report_type: str,
    reason: str,
    note: str | None = None,
    status: str = "submitted",
) -> dict:
    now = datetime.now(UTC)

    return {
        "report_id": report_id,
        "session_id": session_id,
        "assistant_message_id": assistant_message_id,
        "user_firebase_uid": user_firebase_uid,
        "report_type": report_type,
        "reason": reason,
        "note": note,
        "status": status,
        "created_at": now,
        "updated_at": now,
    }