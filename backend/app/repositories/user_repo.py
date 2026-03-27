from datetime import datetime, UTC
from app.db.mongo import get_database
from app.models.user_model import build_user_document


class UserRepository:
    def __init__(self):
        self.collection = get_database()["users"]

    async def find_by_firebase_uid(self, firebase_uid: str) -> dict | None:
        return await self.collection.find_one({"firebase_uid": firebase_uid})

    async def find_by_email(self, email: str) -> dict | None:
        return await self.collection.find_one({"email": email})

    async def create_user(
        self,
        firebase_uid: str,
        email: str | None,
        display_name: str | None,
        picture: str | None = None,
    ) -> dict:
        user_doc = build_user_document(
            firebase_uid=firebase_uid,
            email=email,
            display_name=display_name,
            picture=picture,
        )

        await self.collection.insert_one(user_doc)
        return user_doc

    async def update_user(
        self,
        firebase_uid: str,
        email: str | None,
        display_name: str | None,
        picture: str | None = None,
    ) -> dict | None:
        now = datetime.now(UTC)

        update_data = {
            "email": email,
            "display_name": display_name,
            "picture": picture,
            "updated_at": now,
        }

        await self.collection.update_one(
            {"firebase_uid": firebase_uid},
            {"$set": update_data}
        )

        return await self.find_by_firebase_uid(firebase_uid)

    async def upsert_user(
        self,
        firebase_uid: str,
        email: str | None,
        display_name: str | None,
        picture: str | None = None,
    ) -> dict:
        existing_user = await self.find_by_firebase_uid(firebase_uid)

        if existing_user:
            updated_user = await self.update_user(
                firebase_uid=firebase_uid,
                email=email,
                display_name=display_name,
                picture=picture,
            )
            return updated_user

        new_user = await self.create_user(
            firebase_uid=firebase_uid,
            email=email,
            display_name=display_name,
            picture=picture,
        )
        return new_user