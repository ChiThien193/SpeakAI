from datetime import datetime
from typing import Optional

def build_user_document(
    firebase_uid: str,
    email: Optional[str] = None,
    display_name: Optional[str] = None,
    picture: Optional[str] = None,
    role: str = "learner",
    target_level: str = "A2",
):
    now = datetime.utcnow()
    return {
        "firebase_uid": firebase_uid,
        "email": email,
        "display_name": display_name,
        "picture": picture,
        "role": role,
        "target_level": target_level,
        "created_at": now,
        "updated_at": now,
    }