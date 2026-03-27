from datetime import datetime, UTC
from app.db.mongo import get_database
from app.models.scenario_model import build_scenario_document


class ScenarioRepository:
    def __init__(self):
        self.collection = get_database()["scenarios"]

    async def find_all_active(self) -> list[dict]:
        cursor = self.collection.find({"status": "active"}).sort("created_at", 1)
        return await cursor.to_list(length=1000)

    async def find_all(self) -> list[dict]:
        cursor = self.collection.find().sort("created_at", 1)
        return await cursor.to_list(length=1000)

    async def find_by_scenario_id(self, scenario_id: str) -> dict | None:
        return await self.collection.find_one({"scenario_id": scenario_id})

    async def find_by_slug(self, slug: str) -> dict | None:
        return await self.collection.find_one({"slug": slug})

    async def create_scenario(
        self,
        scenario_id: str,
        title: str,
        slug: str,
        description: str,
        level: str,
        category: str,
        goals: list[str],
        vocabulary: list[str],
        patterns: list[str],
        kb_path: str | None = None,
        status: str = "active",
    ) -> dict:
        scenario_doc = build_scenario_document(
            scenario_id=scenario_id,
            title=title,
            slug=slug,
            description=description,
            level=level,
            category=category,
            goals=goals,
            vocabulary=vocabulary,
            patterns=patterns,
            kb_path=kb_path,
            status=status,
        )

        await self.collection.insert_one(scenario_doc)
        return scenario_doc

    async def update_scenario_status(self, scenario_id: str, status: str) -> dict | None:
        now = datetime.now(UTC)

        await self.collection.update_one(
            {"scenario_id": scenario_id},
            {
                "$set": {
                    "status": status,
                    "updated_at": now,
                }
            }
        )

        return await self.find_by_scenario_id(scenario_id)