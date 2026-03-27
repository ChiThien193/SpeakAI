from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class FirebaseUserPayload(BaseModel):
    uid: str
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    picture: Optional[str] = None


class UserResponse(BaseModel):
    firebase_uid: str
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    picture: Optional[str] = None
    role: str = Field(default="learner")
    target_level: str = Field(default="A2")


class SyncMeResponse(BaseModel):
    message: str
    user: UserResponse