from datetime import datetime, UTC


def build_session_document(
    session_id: str,
    user_firebase_uid: str,
    scenario_id: str,
    mode: str = "rag",
    status: str = "active",
) -> dict:
    now = datetime.now(UTC)

    return {
        "session_id": session_id,
        "user_firebase_uid": user_firebase_uid,
        "scenario_id": scenario_id,
        "mode": mode,
        "status": status,
        "started_at": now,
        "ended_at": None,
        "created_at": now,
        "updated_at": now,
    }