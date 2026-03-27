from app.repositories.user_repo import UserRepository


class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()

    async def sync_user_from_firebase(self, firebase_payload: dict) -> dict:
        firebase_uid = firebase_payload.get("uid")
        email = firebase_payload.get("email")
        display_name = firebase_payload.get("name")
        picture = firebase_payload.get("picture")

        user = await self.user_repo.upsert_user(
            firebase_uid=firebase_uid,
            email=email,
            display_name=display_name,
            picture=picture,
        )

        return user

    async def get_user_profile(self, firebase_uid: str) -> dict | None:
        return await self.user_repo.find_by_firebase_uid(firebase_uid)