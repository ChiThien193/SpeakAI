from app.services.admin_service import AdminService


def test_admin_overview_ok(client, monkeypatch):
    async def fake_get_overview(self):
        return {
            "total_users": 10,
            "learner_users": 9,
            "admin_users": 1,
            "active_scenarios": 3,
            "total_sessions": 20,
            "active_sessions": 2,
            "ended_sessions": 18,
            "total_messages": 150,
            "total_audio_messages": 50,
            "total_feedbacks": 12,
            "average_feedback_rating": 4.58,
            "total_reports": 3,
            "open_reports": 1,
            "unread_notifications": 4,
        }

    monkeypatch.setattr(AdminService, "get_overview", fake_get_overview)

    response = client.get("/api/admin/analytics/overview")

    assert response.status_code == 200
    data = response.json()
    assert data["total_users"] == 10
    assert data["admin_users"] == 1
    assert "X-Request-ID" in response.headers


def test_admin_reports_ok(client, monkeypatch):
    async def fake_list_reports(self, status=None, limit=100):
        return [
            {
                "report_id": "report_1",
                "session_id": "session_1",
                "assistant_message_id": "msg_1",
                "user_firebase_uid": "user_1",
                "report_type": "off_topic",
                "reason": "Not aligned",
                "note": "Wrong context",
                "status": "submitted",
                "created_at": "2026-03-28T10:00:00Z",
                "updated_at": "2026-03-28T10:00:00Z",
                "admin_note": None,
            }
        ]

    monkeypatch.setattr(AdminService, "list_reports", fake_list_reports)

    response = client.get("/api/admin/reports")

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["report_id"] == "report_1"


def test_admin_update_report_status_ok(client, monkeypatch):
    async def fake_update_report_status(self, report_id, status, admin_note=None):
        return {
            "report_id": report_id,
            "session_id": "session_1",
            "assistant_message_id": "msg_1",
            "user_firebase_uid": "user_1",
            "report_type": "off_topic",
            "reason": "Not aligned",
            "note": "Wrong context",
            "status": status,
            "created_at": "2026-03-28T10:00:00Z",
            "updated_at": "2026-03-28T10:05:00Z",
            "admin_note": admin_note,
        }

    monkeypatch.setattr(AdminService, "update_report_status", fake_update_report_status)

    response = client.patch(
        "/api/admin/reports/report_1/status",
        json={
            "status": "resolved",
            "admin_note": "Checked and closed",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "resolved"
    assert data["admin_note"] == "Checked and closed"