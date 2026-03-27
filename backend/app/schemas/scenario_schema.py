from pydantic import BaseModel, Field
from typing import Optional


class ScenarioCreateRequest(BaseModel):
    title: str = Field(..., min_length=2)
    description: str = Field(..., min_length=2)
    level: str = Field(default="A2")
    category: str = Field(default="general")
    goals: list[str] = Field(default_factory=list)
    vocabulary: list[str] = Field(default_factory=list)
    patterns: list[str] = Field(default_factory=list)
    kb_path: Optional[str] = None


class ScenarioResponse(BaseModel):
    scenario_id: str
    title: str
    slug: str
    description: str
    level: str
    category: str
    goals: list[str]
    vocabulary: list[str]
    patterns: list[str]
    kb_path: Optional[str] = None
    status: str


class ScenarioListResponse(BaseModel):
    items: list[ScenarioResponse]
    total: int


class SeedScenarioResponse(BaseModel):
    message: str
    inserted_count: int