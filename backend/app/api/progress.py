from fastapi import APIRouter, Depends
from app.api_deps import get_current_user
from app.schemas.progress_schema import (
    ProgressSummaryResponse,
    ScenarioProgressListResponse,
)
from app.services.progress_service import ProgressService

router = APIRouter()


@router.get("/summary", response_model=ProgressSummaryResponse)
async def get_progress_summary(current_user: dict = Depends(get_current_user)):
    progress_service = ProgressService()
    result = await progress_service.get_summary(current_user["uid"])
    return result


@router.get("/scenarios", response_model=ScenarioProgressListResponse)
async def get_progress_by_scenario(current_user: dict = Depends(get_current_user)):
    progress_service = ProgressService()
    items = await progress_service.get_scenario_progress(current_user["uid"])

    return {
        "items": items,
        "total": len(items),
    }