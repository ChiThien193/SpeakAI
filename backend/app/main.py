from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.core.config import settings
from app.db.mongo import connect_mongo, close_mongo
from app.db.chroma import connect_chroma
from app.clients.firebase_client import initialize_firebase

from app.core.logging import configure_logging
from app.core.request_middleware import register_request_middleware
from app.core.error_handlers import register_exception_handlers

from app.api.health import router as health_router
from app.api.auth import router as auth_router
from app.api.scenarios import router as scenario_router
from app.api.sessions import router as session_router
from app.api.chat import router as chat_router
from app.api.history import router as history_router
from app.api.rag import router as rag_router
from app.api.speech import router as speech_router
from app.api.feedback import router as feedback_router
from app.api.reports import router as report_router
from app.api.notifications import router as notification_router
from app.api.progress import router as progress_router
from app.api.admin import router as admin_router

configure_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_firebase()
    connect_chroma()
    await connect_mongo()
    yield
    await close_mongo()

def create_app(skip_lifespan: bool = False) -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        lifespan=None if skip_lifespan else lifespan,
    )

    register_request_middleware(app)
    register_exception_handlers(app)

    app.include_router(health_router)
    app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
    app.include_router(scenario_router, prefix="/api/scenarios", tags=["scenarios"])
    app.include_router(session_router, prefix="/api/sessions", tags=["sessions"])
    app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
    app.include_router(history_router, prefix="/api/history", tags=["history"])
    app.include_router(rag_router, prefix="/api/rag", tags=["rag"])
    app.include_router(speech_router, prefix="/api/speech", tags=["speech"])
    app.include_router(feedback_router, prefix="/api/feedback", tags=["feedback"])
    app.include_router(report_router, prefix="/api/reports", tags=["reports"])
    app.include_router(notification_router, prefix="/api/notifications", tags=["notifications"])
    app.include_router(progress_router, prefix="/api/progress", tags=["progress"])
    app.include_router(admin_router, prefix="/api/admin", tags=["admin"])


    app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )

    @app.get("/")
    async def root():
        return {
            "message": "SpeakAI backend is running"
        }

    return app


app = create_app()