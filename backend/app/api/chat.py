from fastapi import APIRouter, Depends
from app.api_deps import get_current_user
from app.schemas.chat_schema import ChatTurnRequest, ChatTurnResponse
from app.services.chat_service import ChatService

router = APIRouter()


@router.post("/turn", response_model=ChatTurnResponse)
async def create_chat_turn(
    payload: ChatTurnRequest,
    current_user: dict = Depends(get_current_user),
):
    chat_service = ChatService()

    result = await chat_service.process_text_turn(
        user_firebase_uid=current_user["uid"],
        session_id=payload.session_id,
        text=payload.text,
    )

    return result