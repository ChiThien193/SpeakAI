from datetime import datetime, UTC


def build_message_document(
    message_id: str,
    session_id: str,
    user_firebase_uid: str,
    role: str,
    text: str,
    input_type: str = "text",
    provider: str = "client",
    feedback: dict | None = None,
    metadata: dict | None = None,
) -> dict:
    now = datetime.now(UTC)

    return {
        "message_id": message_id,
        "session_id": session_id,
        "user_firebase_uid": user_firebase_uid,
        "role": role,
        "text": text,
        "input_type": input_type,
        "provider": provider,
        "feedback": feedback,
        "metadata": metadata or {},
        "created_at": now,
        "updated_at": now,
    }