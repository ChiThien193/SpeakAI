from datetime import datetime, UTC


def build_session_feedback_document(
    feedback_id: str,
    session_id: str,
    scenario_id: str,
    user_firebase_uid: str,
    rating: int,
    usefulness_rating: int | None = None,
    speaking_confidence: int | None = None,
    difficulty: str | None = None,
    comment: str | None = None,
) -> dict:
    now = datetime.now(UTC)

    return {
        "feedback_id": feedback_id,
        "session_id": session_id,
        "scenario_id": scenario_id,
        "user_firebase_uid": user_firebase_uid,
        "rating": rating,
        "usefulness_rating": usefulness_rating,
        "speaking_confidence": speaking_confidence,
        "difficulty": difficulty,
        "comment": comment,
        "created_at": now,
        "updated_at": now,
    }