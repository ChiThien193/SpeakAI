from fastapi import APIRouter, Depends
from app.api_deps import get_current_user
from app.schemas.chat_schema import SessionHistoryResponse
from app.services.chat_service import ChatService

router = APIRouter()


@router.get("/sessions/{session_id}", response_model=SessionHistoryResponse)
async def get_session_history(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    chat_service = ChatService()

    result = await chat_service.get_session_history(
        user_firebase_uid=current_user["uid"],
        session_id=session_id,
    )

    return {
        "session_id": result["session_id"],
        "total": result["total"],
        "items": [
            {
                "message_id": item["message_id"],
                "session_id": item["session_id"],
                "user_firebase_uid": item["user_firebase_uid"],
                "role": item["role"],
                "text": item["text"],
                "input_type": item["input_type"],
                "provider": item["provider"],
                "feedback": item.get("feedback"),
                "created_at": item["created_at"],
            }
            for item in result["items"]
        ],
    }