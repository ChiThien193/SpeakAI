from app.core.exceptions import BadRequestException
from app.repositories.report_repo import ReportRepository
from app.repositories.message_repo import MessageRepository
from app.services.session_service import SessionService
from app.services.notification_service import NotificationService


class ReportService:
    def __init__(self):
        self.report_repo = ReportRepository()
        self.message_repo = MessageRepository()
        self.session_service = SessionService()
        self.notification_service = NotificationService()

    async def create_ai_response_report(
        self,
        user_firebase_uid: str,
        session_id: str,
        assistant_message_id: str,
        report_type: str,
        reason: str,
        note: str | None = None,
    ) -> dict:
        session = await self.session_service.get_session_by_id(
            session_id=session_id,
            user_firebase_uid=user_firebase_uid,
        )

        assistant_message = await self.message_repo.find_by_message_id(assistant_message_id)

        if not assistant_message:
            raise BadRequestException("Assistant message not found")

        if assistant_message["session_id"] != session["session_id"]:
            raise BadRequestException("Assistant message does not belong to this session")

        if assistant_message["user_firebase_uid"] != user_firebase_uid:
            raise BadRequestException("Assistant message does not belong to this user")

        if assistant_message["role"] != "assistant":
            raise BadRequestException("Only assistant messages can be reported")

        report = await self.report_repo.create_report(
            session_id=session_id,
            assistant_message_id=assistant_message_id,
            user_firebase_uid=user_firebase_uid,
            report_type=report_type,
            reason=reason,
            note=note,
        )

        await self.notification_service.create_notification(
            user_firebase_uid=user_firebase_uid,
            notification_type="ai_report_submitted",
            title="AI response reported",
            message="Your AI response report has been submitted successfully.",
            data={
                "session_id": session_id,
                "assistant_message_id": assistant_message_id,
                "report_id": report["report_id"],
            },
        )

        return report