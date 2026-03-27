def test_root_ok(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["message"] == "SpeakAI backend is running"
    assert "X-Request-ID" in response.headers
    assert "X-Process-Time-MS" in response.headers