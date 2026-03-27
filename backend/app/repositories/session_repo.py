from datetime import datetime, UTC
from app.db.mongo import get_database
from app.models.session_model import build_session_document


class SessionRepository:
    def __init__(self):
        self.collection = get_database()["sessions"]

    async def create_session(
        self,
        session_id: str,
        user_firebase_uid: str,
        scenario_id: str,
        mode: str = "rag",
        status: str = "active",
    ) -> dict:
        session_doc = build_session_document(
            session_id=session_id,
            user_firebase_uid=user_firebase_uid,
            scenario_id=scenario_id,
            mode=mode,
            status=status,
        )

        await self.collection.insert_one(session_doc)
        return session_doc

    async def find_by_session_id(self, session_id: str) -> dict | None:
        return await self.collection.find_one({"session_id": session_id})

    async def find_by_session_id_and_user(self, session_id: str, user_firebase_uid: str) -> dict | None:
        return await self.collection.find_one(
            {
                "session_id": session_id,
                "user_firebase_uid": user_firebase_uid,
            }
        )

    async def find_by_user(self, user_firebase_uid: str) -> list[dict]:
        cursor = self.collection.find(
            {"user_firebase_uid": user_firebase_uid}
        ).sort("started_at", -1)

        return await cursor.to_list(length=1000)

    async def end_session(self, session_id: str) -> dict | None:
        now = datetime.now(UTC)

        await self.collection.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    "status": "ended",
                    "ended_at": now,
                    "updated_at": now,
                }
            }
        )

        return await self.find_by_session_id(session_id)