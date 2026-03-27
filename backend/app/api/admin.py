from fastapi import APIRouter, Depends, Query

from app.api_deps import get_current_admin_user
from app.schemas.admin_schema import (
    AdminOverviewResponse,
    AdminReportItemResponse,
    AdminReportListResponse,
    AdminScenarioAnalyticsListResponse,
    AdminUpdateReportStatusRequest,
)
from app.services.admin_service import AdminService

router = APIRouter()


@router.get("/analytics/overview", response_model=AdminOverviewResponse)
async def get_admin_overview(
    current_admin: dict = Depends(get_current_admin_user),
):
    admin_service = AdminService()
    return await admin_service.get_overview()


@router.get("/analytics/scenarios", response_model=AdminScenarioAnalyticsListResponse)
async def get_admin_scenario_analytics(
    current_admin: dict = Depends(get_current_admin_user),
):
    admin_service = AdminService()
    items = await admin_service.get_scenario_analytics()

    return {
        "items": items,
        "total": len(items),
    }


@router.get("/reports", response_model=AdminReportListResponse)
async def get_admin_reports(
    status: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    current_admin: dict = Depends(get_current_admin_user),
):
    admin_service = AdminService()
    items = await admin_service.list_reports(status=status, limit=limit)

    return {
        "items": items,
        "total": len(items),
    }


@router.patch("/reports/{report_id}/status", response_model=AdminReportItemResponse)
async def update_admin_report_status(
    report_id: str,
    payload: AdminUpdateReportStatusRequest,
    current_admin: dict = Depends(get_current_admin_user),
):
    admin_service = AdminService()
    item = await admin_service.update_report_status(
        report_id=report_id,
        status=payload.status,
        admin_note=payload.admin_note,
    )

    return item