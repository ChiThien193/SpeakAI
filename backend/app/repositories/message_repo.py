from app.db.mongo import get_database
from app.models.message_model import build_message_document


class MessageRepository:
    def __init__(self):
        self.collection = get_database()["messages"]

    async def create_message(
        self,
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
        message_doc = build_message_document(
            message_id=message_id,
            session_id=session_id,
            user_firebase_uid=user_firebase_uid,
            role=role,
            text=text,
            input_type=input_type,
            provider=provider,
            feedback=feedback,
            metadata=metadata,
        )

        await self.collection.insert_one(message_doc)
        return message_doc

    async def find_by_message_id(self, message_id: str) -> dict | None:
        return await self.collection.find_one({"message_id": message_id})

    async def find_by_session_id(self, session_id: str) -> list[dict]:
        cursor = self.collection.find(
            {"session_id": session_id}
        ).sort("created_at", 1)

        return await cursor.to_list(length=5000)

    async def find_recent_by_session_id(self, session_id: str, limit: int = 10) -> list[dict]:
        cursor = self.collection.find(
            {"session_id": session_id}
        ).sort("created_at", -1).limit(limit)

        items = await cursor.to_list(length=limit)
        items.reverse()
        return items