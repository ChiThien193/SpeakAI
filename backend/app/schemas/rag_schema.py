from pydantic import BaseModel


class RagIndexResponse(BaseModel):
    message: str
    scenario_id: str
    indexed_count: int


class RagReindexAllResponse(BaseModel):
    message: str
    total_scenarios: int
    total_chunks: int