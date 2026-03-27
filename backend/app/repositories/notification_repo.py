from datetime import datetime, UTC
from app.db.mongo import get_database
from app.models.notification_model import build_notification_document


class NotificationRepository:
    def __init__(self):
        self.collection = get_database()["notifications"]

    async def create_notification(
        self,
        user_firebase_uid: str,
        notification_type: str,
        title: str,
        message: str,
        data: dict | None = None,
    ) -> dict:
        notification_doc = build_notification_document(
            notification_id=__import__("uuid").uuid4().hex,
            user_firebase_uid=user_firebase_uid,
            notification_type=notification_type,
            title=title,
            message=message,
            data=data,
        )

        await self.collection.insert_one(notification_doc)
        return notification_doc

    async def find_by_user(
        self,
        user_firebase_uid: str,
        only_unread: bool = False,
        limit: int = 50,
    ) -> list[dict]:
        query = {"user_firebase_uid": user_firebase_uid}
        if only_unread:
            query["is_read"] = False

        cursor = self.collection.find(query).sort("created_at", -1).limit(limit)
        return await cursor.to_list(length=limit)

    async def count_unread(self, user_firebase_uid: str) -> int:
        return await self.collection.count_documents(
            {
                "user_firebase_uid": user_firebase_uid,
                "is_read": False,
            }
        )

    async def find_by_id_and_user(self, notification_id: str, user_firebase_uid: str) -> dict | None:
        return await self.collection.find_one(
            {
                "notification_id": notification_id,
                "user_firebase_uid": user_firebase_uid,
            }
        )

    async def mark_as_read(self, notification_id: str, user_firebase_uid: str) -> dict | None:
        await self.collection.update_one(
            {
                "notification_id": notification_id,
                "user_firebase_uid": user_firebase_uid,
            },
            {
                "$set": {
                    "is_read": True,
                    "updated_at": datetime.now(UTC),
                }
            }
        )

        return await self.find_by_id_and_user(notification_id, user_firebase_uid)

    async def mark_all_as_read(self, user_firebase_uid: str) -> int:
        result = await self.collection.update_many(
            {
                "user_firebase_uid": user_firebase_uid,
                "is_read": False,
            },
            {
                "$set": {
                    "is_read": True,
                    "updated_at": datetime.now(UTC),
                }
            }
        )

        return result.modified_count