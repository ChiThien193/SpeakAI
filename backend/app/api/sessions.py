from fastapi import APIRouter, Depends
from app.api_deps import get_current_user
from app.schemas.session_schema import (
    SessionCreateRequest,
    SessionListResponse,
    SessionResponse,
)
from app.services.session_service import SessionService

router = APIRouter()


@router.post("", response_model=SessionResponse)
async def create_session(
    payload: SessionCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    session_service = SessionService()

    session = await session_service.create_session(
        user_firebase_uid=current_user["uid"],
        scenario_id=payload.scenario_id,
        mode=payload.mode,
    )

    return {
        "session_id": session["session_id"],
        "user_firebase_uid": session["user_firebase_uid"],
        "scenario_id": session["scenario_id"],
        "mode": session["mode"],
        "status": session["status"],
        "started_at": session["started_at"],
        "ended_at": session["ended_at"],
    }


@router.get("", response_model=SessionListResponse)
async def get_my_sessions(current_user: dict = Depends(get_current_user)):
    session_service = SessionService()
    items = await session_service.get_sessions_by_user(current_user["uid"])

    return {
        "items": [
            {
                "session_id": item["session_id"],
                "user_firebase_uid": item["user_firebase_uid"],
                "scenario_id": item["scenario_id"],
                "mode": item["mode"],
                "status": item["status"],
                "started_at": item["started_at"],
                "ended_at": item["ended_at"],
            }
            for item in items
        ],
        "total": len(items),
    }


@router.get("/{session_id}", response_model=SessionResponse)
async def get_session_detail(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    session_service = SessionService()
    item = await session_service.get_session_by_id(
        session_id=session_id,
        user_firebase_uid=current_user["uid"],
    )

    return {
        "session_id": item["session_id"],
        "user_firebase_uid": item["user_firebase_uid"],
        "scenario_id": item["scenario_id"],
        "mode": item["mode"],
        "status": item["status"],
        "started_at": item["started_at"],
        "ended_at": item["ended_at"],
    }


@router.patch("/{session_id}/end", response_model=SessionResponse)
async def end_session(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    session_service = SessionService()
    item = await session_service.end_session(
        session_id=session_id,
        user_firebase_uid=current_user["uid"],
    )

    return {
        "session_id": item["session_id"],
        "user_firebase_uid": item["user_firebase_uid"],
        "scenario_id": item["scenario_id"],
        "mode": item["mode"],
        "status": item["status"],
        "started_at": item["started_at"],
        "ended_at": item["ended_at"],
    }