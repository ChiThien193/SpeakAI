from app.core.exceptions import NotFoundException
from app.repositories.feedback_repo import FeedbackRepository
from app.services.session_service import SessionService
from app.services.notification_service import NotificationService


class FeedbackService:
    def __init__(self):
        self.feedback_repo = FeedbackRepository()
        self.session_service = SessionService()
        self.notification_service = NotificationService()

    async def submit_session_feedback(
        self,
        user_firebase_uid: str,
        session_id: str,
        rating: int,
        usefulness_rating: int | None = None,
        speaking_confidence: int | None = None,
        difficulty: str | None = None,
        comment: str | None = None,
    ) -> dict:
        session = await self.session_service.get_session_by_id(
            session_id=session_id,
            user_firebase_uid=user_firebase_uid,
        )

        feedback = await self.feedback_repo.upsert_session_feedback(
            session_id=session["session_id"],
            scenario_id=session["scenario_id"],
            user_firebase_uid=user_firebase_uid,
            rating=rating,
            usefulness_rating=usefulness_rating,
            speaking_confidence=speaking_confidence,
            difficulty=difficulty,
            comment=comment,
        )

        await self.notification_service.create_notification(
            user_firebase_uid=user_firebase_uid,
            notification_type="session_feedback_saved",
            title="Session feedback saved",
            message=f"Your feedback for session {session['session_id']} has been saved.",
            data={
                "session_id": session["session_id"],
                "scenario_id": session["scenario_id"],
            },
        )

        return feedback

    async def get_feedback_by_session(self, session_id: str, user_firebase_uid: str) -> dict:
        await self.session_service.get_session_by_id(
            session_id=session_id,
            user_firebase_uid=user_firebase_uid,
        )

        feedback = await self.feedback_repo.find_by_session_and_user(
            session_id=session_id,
            user_firebase_uid=user_firebase_uid,
        )

        if not feedback:
            raise NotFoundException("Session feedback not found")

        return feedback