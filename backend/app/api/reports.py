from fastapi import APIRouter, Depends
from app.api_deps import get_current_user
from app.schemas.report_schema import AiResponseReportRequest, AiResponseReportResponse
from app.services.report_service import ReportService

router = APIRouter()


@router.post("/ai-response", response_model=AiResponseReportResponse)
async def report_ai_response(
    payload: AiResponseReportRequest,
    current_user: dict = Depends(get_current_user),
):
    report_service = ReportService()

    item = await report_service.create_ai_response_report(
        user_firebase_uid=current_user["uid"],
        session_id=payload.session_id,
        assistant_message_id=payload.assistant_message_id,
        report_type=payload.report_type,
        reason=payload.reason,
        note=payload.note,
    )

    return item