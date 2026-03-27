from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None


async def create_indexes():
    db = get_database()

    await db["users"].create_index("firebase_uid", unique=True)
    await db["users"].create_index("email", unique=True, sparse=True)

    await db["scenarios"].create_index("scenario_id", unique=True)
    await db["scenarios"].create_index("slug", unique=True)
    await db["scenarios"].create_index("status")

    await db["sessions"].create_index("session_id", unique=True)
    await db["sessions"].create_index("user_firebase_uid")
    await db["sessions"].create_index("scenario_id")
    await db["sessions"].create_index([("user_firebase_uid", 1), ("started_at", -1)])

    await db["messages"].create_index("message_id", unique=True)
    await db["messages"].create_index("session_id")
    await db["messages"].create_index("user_firebase_uid")
    await db["messages"].create_index([("session_id", 1), ("created_at", 1)])

    await db["session_feedbacks"].create_index("feedback_id", unique=True)
    await db["session_feedbacks"].create_index(
        [("session_id", 1), ("user_firebase_uid", 1)],
        unique=True
    )
    await db["session_feedbacks"].create_index("scenario_id")
    await db["session_feedbacks"].create_index("user_firebase_uid")

    await db["ai_reports"].create_index("report_id", unique=True)
    await db["ai_reports"].create_index("user_firebase_uid")
    await db["ai_reports"].create_index("session_id")
    await db["ai_reports"].create_index("assistant_message_id")
    await db["ai_reports"].create_index([("user_firebase_uid", 1), ("created_at", -1)])

    await db["notifications"].create_index("notification_id", unique=True)
    await db["notifications"].create_index("user_firebase_uid")
    await db["notifications"].create_index("is_read")
    await db["notifications"].create_index([("user_firebase_uid", 1), ("created_at", -1)])
    await db["notifications"].create_index([("user_firebase_uid", 1), ("is_read", 1)])

    print("MongoDB indexes created")


async def connect_mongo():
    global client, database

    if client is None:
        client = AsyncIOMotorClient(settings.mongo_uri)
        database = client[settings.mongo_db_name]
        await create_indexes()
        print("Connected to MongoDB")


async def close_mongo():
    global client, database

    if client is not None:
        client.close()
        client = None
        database = None
        print("Disconnected from MongoDB")


def get_database() -> AsyncIOMotorDatabase:
    if database is None:
        raise RuntimeError("MongoDB is not connected")
    return database