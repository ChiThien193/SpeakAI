from fastapi import APIRouter, Depends
from app.api_deps import get_current_user
from app.schemas.feedback_schema import SessionFeedbackRequest, SessionFeedbackResponse
from app.services.feedback_service import FeedbackService

router = APIRouter()


@router.post("/session", response_model=SessionFeedbackResponse)
async def submit_session_feedback(
    payload: SessionFeedbackRequest,
    current_user: dict = Depends(get_current_user),
):
    feedback_service = FeedbackService()

    item = await feedback_service.submit_session_feedback(
        user_firebase_uid=current_user["uid"],
        session_id=payload.session_id,
        rating=payload.rating,
        usefulness_rating=payload.usefulness_rating,
        speaking_confidence=payload.speaking_confidence,
        difficulty=payload.difficulty,
        comment=payload.comment,
    )

    return item


@router.get("/session/{session_id}", response_model=SessionFeedbackResponse)
async def get_session_feedback(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    feedback_service = FeedbackService()
    item = await feedback_service.get_feedback_by_session(
        session_id=session_id,
        user_firebase_uid=current_user["uid"],
    )

    return item