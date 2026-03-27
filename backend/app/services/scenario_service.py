from app.repositories.scenario_repo import ScenarioRepository
from app.core.exceptions import NotFoundException, ConflictException, BadRequestException


class ScenarioService:
    def __init__(self):
        self.scenario_repo = ScenarioRepository()

    async def get_all_active_scenarios(self) -> list[dict]:
        return await self.scenario_repo.find_all_active()

    async def get_scenario_by_id(self, scenario_id: str) -> dict:
        scenario = await self.scenario_repo.find_by_scenario_id(scenario_id)

        if not scenario:
            raise NotFoundException("Scenario not found")

        return scenario

    async def create_scenario(self, payload: dict) -> dict:
        existing_by_id = await self.scenario_repo.find_by_scenario_id(payload["scenario_id"])
        if existing_by_id:
            raise ConflictException("Scenario ID already exists")

        existing_by_slug = await self.scenario_repo.find_by_slug(payload["slug"])
        if existing_by_slug:
            raise ConflictException("Scenario slug already exists")

        if payload["status"] not in ["active", "inactive"]:
            raise BadRequestException("Scenario status must be 'active' or 'inactive'")

        return await self.scenario_repo.create_scenario(**payload)

    async def seed_default_scenarios(self) -> int:
        default_scenarios = [
            {
                "scenario_id": "restaurant_basic",
                "title": "Ordering Food at a Restaurant",
                "slug": "restaurant-basic",
                "description": "Practice ordering food politely in a restaurant.",
                "level": "A2",
                "category": "daily-life",
                "goals": ["order food", "ask about menu", "pay the bill"],
                "vocabulary": ["menu", "bill", "waiter", "drink", "dish"],
                "patterns": ["I'd like...", "Can I have...?", "Could I get...?"],
                "kb_path": "kb/restaurant/basic.txt",
                "status": "active",
            },
            {
                "scenario_id": "job_interview_basic",
                "title": "Basic Job Interview",
                "slug": "job-interview-basic",
                "description": "Practice answering common interview questions.",
                "level": "B1",
                "category": "career",
                "goals": ["introduce yourself", "talk about strengths", "answer interview questions"],
                "vocabulary": ["experience", "strength", "skill", "position", "teamwork"],
                "patterns": ["I have experience in...", "One of my strengths is...", "I am interested in..."],
                "kb_path": "kb/interview/basic.txt",
                "status": "active",
            },
            {
                "scenario_id": "travel_airport_basic",
                "title": "At the Airport",
                "slug": "travel-airport-basic",
                "description": "Practice common English conversations at the airport.",
                "level": "A2",
                "category": "travel",
                "goals": ["check in", "ask for gate information", "confirm luggage"],
                "vocabulary": ["boarding pass", "gate", "luggage", "passport", "check-in"],
                "patterns": ["Where is gate...?", "I'd like to check in.", "Here is my passport."],
                "kb_path": "kb/travel/airport.txt",
                "status": "active",
            },
        ]

        inserted_count = 0

        for scenario in default_scenarios:
            existing = await self.scenario_repo.find_by_scenario_id(scenario["scenario_id"])
            if not existing:
                await self.scenario_repo.create_scenario(**scenario)
                inserted_count += 1

        return inserted_count