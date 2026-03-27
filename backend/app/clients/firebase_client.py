import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import settings


def initialize_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.firebase_credentials)
        firebase_admin.initialize_app(cred)
        print("Firebase initialized")


def verify_firebase_token(id_token: str) -> dict:
    decoded_token = auth.verify_id_token(id_token)
    return decoded_token

# initialize_firebase() chỉ khởi tạo 1 lần
# verify_firebase_token() dùng để decode + verify token từ frontend gửi lên