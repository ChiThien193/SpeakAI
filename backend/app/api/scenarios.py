from fastapi import APIRouter
from app.schemas.scenario_schema import (
    ScenarioCreateRequest,
    ScenarioListResponse,
    ScenarioResponse,
    SeedScenarioResponse,
)
from app.services.scenario_service import ScenarioService

router = APIRouter()


@router.get("", response_model=ScenarioListResponse)
async def get_scenarios():
    scenario_service = ScenarioService()
    items = await scenario_service.get_all_active_scenarios()

    return {
        "items": [
            {
                "scenario_id": item["scenario_id"],
                "title": item["title"],
                "slug": item["slug"],
                "description": item["description"],
                "level": item["level"],
                "category": item["category"],
                "goals": item["goals"],
                "vocabulary": item["vocabulary"],
                "patterns": item["patterns"],
                "kb_path": item.get("kb_path"),
                "status": item["status"],
            }
            for item in items
        ],
        "total": len(items),
    }


@router.get("/{scenario_id}", response_model=ScenarioResponse)
async def get_scenario_detail(scenario_id: str):
    scenario_service = ScenarioService()
    item = await scenario_service.get_scenario_by_id(scenario_id)

    return {
        "scenario_id": item["scenario_id"],
        "title": item["title"],
        "slug": item["slug"],
        "description": item["description"],
        "level": item["level"],
        "category": item["category"],
        "goals": item["goals"],
        "vocabulary": item["vocabulary"],
        "patterns": item["patterns"],
        "kb_path": item.get("kb_path"),
        "status": item["status"],
    }


@router.post("", response_model=ScenarioResponse)
async def create_scenario(payload: ScenarioCreateRequest):
    scenario_service = ScenarioService()
    item = await scenario_service.create_scenario(payload.model_dump())

    return {
        "scenario_id": item["scenario_id"],
        "title": item["title"],
        "slug": item["slug"],
        "description": item["description"],
        "level": item["level"],
        "category": item["category"],
        "goals": item["goals"],
        "vocabulary": item["vocabulary"],
        "patterns": item["patterns"],
        "kb_path": item.get("kb_path"),
        "status": item["status"],
    }


@router.post("/seed", response_model=SeedScenarioResponse)
async def seed_scenarios():
    scenario_service = ScenarioService()
    inserted_count = await scenario_service.seed_default_scenarios()

    return {
        "message": "Scenarios seeded successfully",
        "inserted_count": inserted_count,
    }