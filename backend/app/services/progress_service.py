from app.db.mongo import get_database
from app.repositories.notification_repo import NotificationRepository
from app.repositories.scenario_repo import ScenarioRepository


class ProgressService:
    def __init__(self):
        self.db = get_database()
        self.notification_repo = NotificationRepository()
        self.scenario_repo = ScenarioRepository()

    async def get_summary(self, user_firebase_uid: str) -> dict:
        total_sessions = await self.db["sessions"].count_documents(
            {"user_firebase_uid": user_firebase_uid}
        )
        active_sessions = await self.db["sessions"].count_documents(
            {"user_firebase_uid": user_firebase_uid, "status": "active"}
        )
        ended_sessions = await self.db["sessions"].count_documents(
            {"user_firebase_uid": user_firebase_uid, "status": "ended"}
        )

        practiced_scenarios = await self.db["sessions"].distinct(
            "scenario_id",
            {"user_firebase_uid": user_firebase_uid}
        )

        total_user_messages = await self.db["messages"].count_documents(
            {"user_firebase_uid": user_firebase_uid, "role": "user"}
        )
        total_text_messages = await self.db["messages"].count_documents(
            {
                "user_firebase_uid": user_firebase_uid,
                "role": "user",
                "input_type": "text",
            }
        )
        total_audio_messages = await self.db["messages"].count_documents(
            {
                "user_firebase_uid": user_firebase_uid,
                "role": "user",
                "input_type": "audio",
            }
        )

        reports_submitted = await self.db["ai_reports"].count_documents(
            {"user_firebase_uid": user_firebase_uid}
        )

        feedback_stats_cursor = self.db["session_feedbacks"].aggregate(
            [
                {"$match": {"user_firebase_uid": user_firebase_uid}},
                {
                    "$group": {
                        "_id": None,
                        "submitted_feedbacks": {"$sum": 1},
                        "average_feedback_rating": {"$avg": "$rating"},
                    }
                },
            ]
        )
        feedback_stats = await feedback_stats_cursor.to_list(length=1)
        feedback_stats = feedback_stats[0] if feedback_stats else {}

        last_message = await self.db["messages"].find_one(
            {"user_firebase_uid": user_firebase_uid},
            sort=[("created_at", -1)]
        )

        last_session = await self.db["sessions"].find_one(
            {"user_firebase_uid": user_firebase_uid},
            sort=[("started_at", -1)]
        )

        last_activity_at = None
        if last_message:
            last_activity_at = last_message["created_at"]
        elif last_session:
            last_activity_at = last_session["started_at"]

        unread_notifications = await self.notification_repo.count_unread(user_firebase_uid)

        return {
            "total_sessions": total_sessions,
            "active_sessions": active_sessions,
            "ended_sessions": ended_sessions,
            "practiced_scenarios_count": len(practiced_scenarios),
            "practiced_scenarios": practiced_scenarios,
            "total_user_messages": total_user_messages,
            "total_text_messages": total_text_messages,
            "total_audio_messages": total_audio_messages,
            "submitted_feedbacks": feedback_stats.get("submitted_feedbacks", 0),
            "average_feedback_rating": round(float(feedback_stats.get("average_feedback_rating", 0.0)), 2),
            "reports_submitted": reports_submitted,
            "unread_notifications": unread_notifications,
            "last_activity_at": last_activity_at,
        }

    async def get_scenario_progress(self, user_firebase_uid: str) -> list[dict]:
        sessions_pipeline = [
            {"$match": {"user_firebase_uid": user_firebase_uid}},
            {
                "$group": {
                    "_id": "$scenario_id",
                    "sessions_count": {"$sum": 1},
                    "ended_sessions_count": {
                        "$sum": {
                            "$cond": [{"$eq": ["$status", "ended"]}, 1, 0]
                        }
                    },
                    "last_practiced_at": {"$max": "$started_at"},
                }
            },
            {"$sort": {"last_practiced_at": -1}},
        ]
        scenario_session_stats = await self.db["sessions"].aggregate(sessions_pipeline).to_list(length=500)

        message_pipeline = [
            {
                "$match": {
                    "user_firebase_uid": user_firebase_uid,
                    "role": "user",
                }
            },
            {
                "$group": {
                    "_id": "$metadata.scenario_id",
                    "total_user_messages": {"$sum": 1},
                    "total_audio_messages": {
                        "$sum": {
                            "$cond": [{"$eq": ["$input_type", "audio"]}, 1, 0]
                        }
                    },
                }
            },
        ]
        scenario_message_stats = await self.db["messages"].aggregate(message_pipeline).to_list(length=500)

        message_map = {item["_id"]: item for item in scenario_message_stats}

        items: list[dict] = []

        for row in scenario_session_stats:
            scenario_id = row["_id"]
            scenario = await self.scenario_repo.find_by_scenario_id(scenario_id)

            message_info = message_map.get(scenario_id, {})

            items.append(
                {
                    "scenario_id": scenario_id,
                    "title": scenario["title"] if scenario else scenario_id,
                    "level": scenario["level"] if scenario else "unknown",
                    "category": scenario["category"] if scenario else "unknown",
                    "sessions_count": row.get("sessions_count", 0),
                    "ended_sessions_count": row.get("ended_sessions_count", 0),
                    "total_user_messages": message_info.get("total_user_messages", 0),
                    "total_audio_messages": message_info.get("total_audio_messages", 0),
                    "last_practiced_at": row.get("last_practiced_at"),
                }
            )

        return items