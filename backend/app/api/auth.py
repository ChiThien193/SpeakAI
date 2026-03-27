from fastapi import APIRouter, Depends
from app.api_deps import get_current_user
from app.schemas.auth_schema import SyncMeResponse, UserResponse
from app.services.auth_service import AuthService
from app.core.exceptions import NotFoundException

router = APIRouter()


@router.post("/sync-me", response_model=SyncMeResponse)
async def sync_me(current_user: dict = Depends(get_current_user)):
    auth_service = AuthService()

    user = await auth_service.sync_user_from_firebase(current_user)

    return {
        "message": "User synced successfully",
        "user": {
            "firebase_uid": user["firebase_uid"],
            "email": user.get("email"),
            "display_name": user.get("display_name"),
            "picture": user.get("picture"),
            "role": user.get("role", "learner"),
            "target_level": user.get("target_level", "A2"),
        }
    }


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    auth_service = AuthService()

    user = await auth_service.get_user_profile(current_user["uid"])

    if not user:
        raise NotFoundException("User not found. Please call /api/auth/sync-me first.")

    return {
        "firebase_uid": user["firebase_uid"],
        "email": user.get("email"),
        "display_name": user.get("display_name"),
        "picture": user.get("picture"),
        "role": user.get("role", "learner"),
        "target_level": user.get("target_level", "A2"),
    }