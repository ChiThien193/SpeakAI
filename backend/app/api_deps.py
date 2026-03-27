from fastapi import Depends, Header
from app.clients.firebase_client import verify_firebase_token
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.repositories.user_repo import UserRepository


async def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization:
        raise UnauthorizedException("Missing Authorization header")

    if not authorization.startswith("Bearer "):
        raise UnauthorizedException("Invalid Authorization header format")

    token = authorization.replace("Bearer ", "").strip()

    if not token:
        raise UnauthorizedException("Missing Bearer token")

    try:
        decoded = verify_firebase_token(token)
        return {
            "uid": decoded.get("uid"),
            "email": decoded.get("email"),
            "name": decoded.get("name"),
            "picture": decoded.get("picture"),
        }
    except Exception as e:
        raise UnauthorizedException(f"Invalid Firebase token: {str(e)}")


async def get_current_synced_user(current_user: dict = Depends(get_current_user)) -> dict:
    user_repo = UserRepository()
    user = await user_repo.find_by_firebase_uid(current_user["uid"])

    if not user:
        raise UnauthorizedException("User not found. Please call /api/auth/sync-me first.")

    return user


async def get_current_admin_user(current_user: dict = Depends(get_current_synced_user)) -> dict:
    if current_user.get("role") != "admin":
        raise ForbiddenException("Admin access required")

    return current_user