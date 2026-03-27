import pytest
from fastapi.testclient import TestClient

from app.main import create_app
from app.api_deps import get_current_admin_user


@pytest.fixture
def client():
    app = create_app(skip_lifespan=True)

    app.dependency_overrides[get_current_admin_user] = lambda: {
        "firebase_uid": "admin_uid",
        "display_name": "Admin",
        "role": "admin",
    }

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()