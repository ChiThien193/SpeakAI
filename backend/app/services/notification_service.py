from app.core.exceptions import NotFoundException
from app.repositories.notification_repo import NotificationRepository


class NotificationService:
    def __init__(self):
        self.notification_repo = NotificationRepository()

    async def create_notification(
        self,
        user_firebase_uid: str,
        notification_type: str,
        title: str,
        message: str,
        data: dict | None = None,
    ) -> dict:
        return await self.notification_repo.create_notification(
            user_firebase_uid=user_firebase_uid,
            notification_type=notification_type,
            title=title,
            message=message,
            data=data,
        )

    async def get_notifications(
        self,
        user_firebase_uid: str,
        only_unread: bool = False,
        limit: int = 50,
    ) -> dict:
        items = await self.notification_repo.find_by_user(
            user_firebase_uid=user_firebase_uid,
            only_unread=only_unread,
            limit=limit,
        )
        unread_count = await self.notification_repo.count_unread(user_firebase_uid)

        return {
            "items": items,
            "total": len(items),
            "unread_count": unread_count,
        }

    async def mark_as_read(self, notification_id: str, user_firebase_uid: str) -> dict:
        item = await self.notification_repo.mark_as_read(notification_id, user_firebase_uid)

        if not item:
            raise NotFoundException("Notification not found")

        return item

    async def mark_all_as_read(self, user_firebase_uid: str) -> int:
        return await self.notification_repo.mark_all_as_read(user_firebase_uid)

    async def count_unread(self, user_firebase_uid: str) -> int:
        return await self.notification_repo.count_unread(user_firebase_uid)