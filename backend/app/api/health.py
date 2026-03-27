from fastapi import APIRouter
from app.core.config import settings
from app.db.mongo import get_database

router = APIRouter()


@router.get("/health")
async def health_check():
    db = get_database()
    collections = await db.list_collection_names()

    return {
        "status": "ok",
        "app_name": settings.app_name,
        "environment": settings.app_env,
        "database": settings.mongo_db_name,
        "collections": collections
    }

# Route này dùng để kiểm tra:

# app có chạy không
# config có load đúng không