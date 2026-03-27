from fastapi import APIRouter
from app.schemas.rag_schema import RagIndexResponse, RagReindexAllResponse
from app.services.rag_service import RagService

router = APIRouter()


@router.post("/reindex/{scenario_id}", response_model=RagIndexResponse)
async def reindex_scenario(scenario_id: str):
    rag_service = RagService()
    indexed_count = await rag_service.reindex_scenario(scenario_id)

    return {
        "message": "Scenario KB indexed successfully",
        "scenario_id": scenario_id,
        "indexed_count": indexed_count,
    }


@router.post("/reindex-all", response_model=RagReindexAllResponse)
async def reindex_all_scenarios():
    rag_service = RagService()
    total_scenarios, total_chunks = await rag_service.reindex_all_scenarios()

    return {
        "message": "All active scenarios indexed successfully",
        "total_scenarios": total_scenarios,
        "total_chunks": total_chunks,
    }
# test db Chroma đã có dữ liệu chưa
@router.get("/peek")
async def peek_rag():
    rag_service = RagService()
    result = rag_service.collection.get(
        limit=10,
        include=["documents", "metadatas"]
    )
    return result

