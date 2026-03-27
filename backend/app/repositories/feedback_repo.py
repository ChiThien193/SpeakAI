from datetime import datetime, UTC
from app.db.mongo import get_database
from app.models.feedback_model import build_session_feedback_document


class FeedbackRepository:
    def __init__(self):
        self.collection = get_database()["session_feedbacks"]

    async def find_by_session_and_user(self, session_id: str, user_firebase_uid: str) -> dict | None:
        return await self.collection.find_one(
            {
                "session_id": session_id,
                "user_firebase_uid": user_firebase_uid,
            }
        )

    async def upsert_session_feedback(
        self,
        session_id: str,
        scenario_id: str,
        user_firebase_uid: str,
        rating: int,
        usefulness_rating: int | None = None,
        speaking_confidence: int | None = None,
        difficulty: str | None = None,
        comment: str | None = None,
    ) -> dict:
        existing = await self.find_by_session_and_user(session_id, user_firebase_uid)

        if existing:
            await self.collection.update_one(
                {"feedback_id": existing["feedback_id"]},
                {
                    "$set": {
                        "rating": rating,
                        "usefulness_rating": usefulness_rating,
                        "speaking_confidence": speaking_confidence,
                        "difficulty": difficulty,
                        "comment": comment,
                        "updated_at": datetime.now(UTC),
                    }
                }
            )
            return await self.find_by_session_and_user(session_id, user_firebase_uid)

        feedback_doc = build_session_feedback_document(
            feedback_id=__import__("uuid").uuid4().hex,
            session_id=session_id,
            scenario_id=scenario_id,
            user_firebase_uid=user_firebase_uid,
            rating=rating,
            usefulness_rating=usefulness_rating,
            speaking_confidence=speaking_confidence,
            difficulty=difficulty,
            comment=comment,
        )

        await self.collection.insert_one(feedback_doc)
        return feedback_doc