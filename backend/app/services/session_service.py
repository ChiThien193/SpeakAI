import uuid
from app.repositories.session_repo import SessionRepository
from app.services.scenario_service import ScenarioService
from app.core.exceptions import NotFoundException, BadRequestException, UnauthorizedException


class SessionService:
    def __init__(self):
        self.session_repo = SessionRepository()
        self.scenario_service = ScenarioService()

    async def create_session(
        self,
        user_firebase_uid: str,
        scenario_id: str,
        mode: str = "rag",
    ) -> dict:
        scenario = await self.scenario_service.get_scenario_by_id(scenario_id)

        if scenario["status"] != "active":
            raise BadRequestException("Scenario is not active")

        if mode not in ["rag", "llm-only"]:
            raise BadRequestException("Mode must be 'rag' or 'llm-only'")

        session_id = str(uuid.uuid4())

        session = await self.session_repo.create_session(
            session_id=session_id,
            user_firebase_uid=user_firebase_uid,
            scenario_id=scenario_id,
            mode=mode,
            status="active",
        )

        return session

    async def get_session_by_id(self, session_id: str, user_firebase_uid: str) -> dict:
        session = await self.session_repo.find_by_session_id_and_user(
            session_id=session_id,
            user_firebase_uid=user_firebase_uid,
        )

        if not session:
            raise NotFoundException("Session not found")

        return session

    async def get_sessions_by_user(self, user_firebase_uid: str) -> list[dict]:
        return await self.session_repo.find_by_user(user_firebase_uid)

    async def end_session(self, session_id: str, user_firebase_uid: str) -> dict:
        session = await self.session_repo.find_by_session_id(session_id)

        if not session:
            raise NotFoundException("Session not found")

        if session["user_firebase_uid"] != user_firebase_uid:
            raise UnauthorizedException("You are not allowed to end this session")

        if session["status"] == "ended":
            raise BadRequestException("Session already ended")

        updated_session = await self.session_repo.end_session(session_id)
        return updated_session