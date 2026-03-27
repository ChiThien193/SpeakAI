from app.core.exceptions import BadRequestException, NotFoundException
from app.db.mongo import get_database
from app.repositories.report_repo import ReportRepository
from app.repositories.scenario_repo import ScenarioRepository


ALLOWED_REPORT_STATUSES = {
    "submitted",
    "reviewing",
    "resolved",
    "dismissed",
}


class AdminService:
    def __init__(self):
        self.db = get_database()
        self.report_repo = ReportRepository()
        self.scenario_repo = ScenarioRepository()

    async def get_overview(self) -> dict:
        total_users = await self.db["users"].count_documents({})
        learner_users = await self.db["users"].count_documents({"role": "learner"})
        admin_users = await self.db["users"].count_documents({"role": "admin"})

        active_scenarios = await self.db["scenarios"].count_documents({"status": "active"})

        total_sessions = await self.db["sessions"].count_documents({})
        active_sessions = await self.db["sessions"].count_documents({"status": "active"})
        ended_sessions = await self.db["sessions"].count_documents({"status": "ended"})

        total_messages = await self.db["messages"].count_documents({})
        total_audio_messages = await self.db["messages"].count_documents(
            {
                "role": "user",
                "input_type": "audio",
            }
        )

        total_feedbacks = await self.db["session_feedbacks"].count_documents({})
        feedback_stats = await self.db["session_feedbacks"].aggregate(
            [
                {
                    "$group": {
                        "_id": None,
                        "average_feedback_rating": {"$avg": "$rating"},
                    }
                }
            ]
        ).to_list(length=1)

        average_feedback_rating = 0.0
        if feedback_stats:
            average_feedback_rating = round(float(feedback_stats[0].get("average_feedback_rating", 0.0)), 2)

        total_reports = await self.db["ai_reports"].count_documents({})
        open_reports = await self.db["ai_reports"].count_documents(
            {"status": {"$in": ["submitted", "reviewing"]}}
        )

        unread_notifications = await self.db["notifications"].count_documents({"is_read": False})

        return {
            "total_users": total_users,
            "learner_users": learner_users,
            "admin_users": admin_users,
            "active_scenarios": active_scenarios,
            "total_sessions": total_sessions,
            "active_sessions": active_sessions,
            "ended_sessions": ended_sessions,
            "total_messages": total_messages,
            "total_audio_messages": total_audio_messages,
            "total_feedbacks": total_feedbacks,
            "average_feedback_rating": average_feedback_rating,
            "total_reports": total_reports,
            "open_reports": open_reports,
            "unread_notifications": unread_notifications,
        }

    async def get_scenario_analytics(self) -> list[dict]:
        sessions_pipeline = [
            {
                "$group": {
                    "_id": "$scenario_id",
                    "sessions_count": {"$sum": 1},
                    "active_sessions_count": {
                        "$sum": {
                            "$cond": [{"$eq": ["$status", "active"]}, 1, 0]
                        }
                    },
                    "ended_sessions_count": {
                        "$sum": {
                            "$cond": [{"$eq": ["$status", "ended"]}, 1, 0]
                        }
                    },
                    "last_session_at": {"$max": "$started_at"},
                }
            }
        ]
        session_rows = await self.db["sessions"].aggregate(sessions_pipeline).to_list(length=500)

        messages_pipeline = [
            {
                "$group": {
                    "_id": "$metadata.scenario_id",
                    "total_messages": {"$sum": 1},
                    "total_user_messages": {
                        "$sum": {
                            "$cond": [{"$eq": ["$role", "user"]}, 1, 0]
                        }
                    },
                    "total_audio_messages": {
                        "$sum": {
                            "$cond": [
                                {
                                    "$and": [
                                        {"$eq": ["$role", "user"]},
                                        {"$eq": ["$input_type", "audio"]},
                                    ]
                                },
                                1,
                                0,
                            ]
                        }
                    },
                }
            }
        ]
        message_rows = await self.db["messages"].aggregate(messages_pipeline).to_list(length=500)

        feedback_pipeline = [
            {
                "$group": {
                    "_id": "$scenario_id",
                    "average_feedback_rating": {"$avg": "$rating"},
                }
            }
        ]
        feedback_rows = await self.db["session_feedbacks"].aggregate(feedback_pipeline).to_list(length=500)

        message_map = {row["_id"]: row for row in message_rows}
        feedback_map = {row["_id"]: row for row in feedback_rows}

        items: list[dict] = []

        for row in session_rows:
            scenario_id = row["_id"]
            scenario = await self.scenario_repo.find_by_scenario_id(scenario_id)
            message_info = message_map.get(scenario_id, {})
            feedback_info = feedback_map.get(scenario_id, {})

            items.append(
                {
                    "scenario_id": scenario_id,
                    "title": scenario["title"] if scenario else scenario_id,
                    "level": scenario["level"] if scenario else "unknown",
                    "category": scenario["category"] if scenario else "unknown",
                    "sessions_count": row.get("sessions_count", 0),
                    "active_sessions_count": row.get("active_sessions_count", 0),
                    "ended_sessions_count": row.get("ended_sessions_count", 0),
                    "total_messages": message_info.get("total_messages", 0),
                    "total_user_messages": message_info.get("total_user_messages", 0),
                    "total_audio_messages": message_info.get("total_audio_messages", 0),
                    "average_feedback_rating": round(
                        float(feedback_info.get("average_feedback_rating", 0.0)),
                        2
                    ),
                    "last_session_at": row.get("last_session_at"),
                }
            )

        items.sort(key=lambda x: (x["sessions_count"], x["total_messages"]), reverse=True)
        return items

    async def list_reports(
        self,
        status: str | None = None,
        limit: int = 100,
    ) -> list[dict]:
        if status and status not in ALLOWED_REPORT_STATUSES:
            raise BadRequestException("Invalid report status filter")

        return await self.report_repo.find_reports(status=status, limit=limit)

    async def update_report_status(
        self,
        report_id: str,
        status: str,
        admin_note: str | None = None,
    ) -> dict:
        if status not in ALLOWED_REPORT_STATUSES:
            raise BadRequestException("Invalid report status")

        existing = await self.report_repo.find_by_report_id(report_id)
        if not existing:
            raise NotFoundException("Report not found")

        updated = await self.report_repo.update_status(
            report_id=report_id,
            status=status,
            admin_note=admin_note,
        )

        return updated