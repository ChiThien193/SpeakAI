from datetime import datetime, UTC
from app.db.mongo import get_database
from app.models.report_model import build_ai_report_document


class ReportRepository:
    def __init__(self):
        self.collection = get_database()["ai_reports"]

    async def create_report(
        self,
        session_id: str,
        assistant_message_id: str,
        user_firebase_uid: str,
        report_type: str,
        reason: str,
        note: str | None = None,
    ) -> dict:
        report_doc = build_ai_report_document(
            report_id=__import__("uuid").uuid4().hex,
            session_id=session_id,
            assistant_message_id=assistant_message_id,
            user_firebase_uid=user_firebase_uid,
            report_type=report_type,
            reason=reason,
            note=note,
        )

        await self.collection.insert_one(report_doc)
        return report_doc

    async def find_by_report_id(self, report_id: str) -> dict | None:
        return await self.collection.find_one({"report_id": report_id})

    async def find_reports(
        self,
        status: str | None = None,
        limit: int = 100,
    ) -> list[dict]:
        query = {}
        if status:
            query["status"] = status

        cursor = self.collection.find(query).sort("created_at", -1).limit(limit)
        return await cursor.to_list(length=limit)

    async def update_status(
        self,
        report_id: str,
        status: str,
        admin_note: str | None = None,
    ) -> dict | None:
        update_data = {
            "status": status,
            "updated_at": datetime.now(UTC),
        }

        if admin_note is not None:
            update_data["admin_note"] = admin_note

        await self.collection.update_one(
            {"report_id": report_id},
            {"$set": update_data}
        )

        return await self.find_by_report_id(report_id)