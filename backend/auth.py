from datetime import datetime, timezone

import requests

from fastapi import APIRouter, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from pymongo.errors import DuplicateKeyError

from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from db import users_collection
from schemas import RegisterRequest, LoginRequest, GoogleAuthRequest, GoogleCodeRequest
from security import hash_password, verify_password, create_access_token

import secrets
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from email_utils import send_reset_password_email
from config import RESET_PASSWORD_URL
from schemas import ForgotPasswordRequest, ResetPasswordRequest
from schemas import ChangePasswordRequest

router = APIRouter()


@router.post("/google/code")
def google_auth_code(payload: GoogleCodeRequest):
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Thiếu GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET")

    token_res = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": payload.code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": "postmessage",
            "grant_type": "authorization_code",
        },
        timeout=15,
    )

    if not token_res.ok:
        raise HTTPException(status_code=401, detail=f"Đổi code Google thất bại: {token_res.text}")

    token_data = token_res.json()
    id_token_jwt = token_data.get("id_token")

    if not id_token_jwt:
        raise HTTPException(status_code=401, detail="Không lấy được id_token từ Google")

    try:
        idinfo = id_token.verify_oauth2_token(
            id_token_jwt,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Google token không hợp lệ: {str(e)}")

    email = idinfo.get("email")
    full_name = idinfo.get("name")
    google_sub = idinfo.get("sub")
    avatar = idinfo.get("picture")

    if not email:
        raise HTTPException(status_code=400, detail="Không lấy được email từ Google")

    email = email.strip().lower()
    user = users_collection.find_one({"email": email})

    if not user:
        user_doc = {
            "full_name": full_name,
            "email": email,
            "password_hash": None,
            "provider": "google",
            "google_sub": google_sub,
            "avatar": avatar,
            "created_at": datetime.now(timezone.utc),
        }
        users_collection.insert_one(user_doc)
        user = user_doc
    else:
        users_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "google_sub": google_sub,
                    "avatar": avatar,
                }
            }
        )
        user = users_collection.find_one({"email": email})

    access_token = create_access_token({
        "email": email,
        "provider": user["provider"]
    })

    return {
        "message": "Đăng nhập Google thành công",
        "access_token": access_token,
        "user": {
            "full_name": user["full_name"],
            "email": user["email"],
            "provider": user["provider"],
            "avatar": user.get("avatar")
        }
    }

@router.post("/register")
def register(payload: RegisterRequest):
    try:
        full_name = payload.full_name.strip()
        email = payload.email.strip().lower()
        password = payload.password.strip()

        if not full_name:
            raise HTTPException(status_code=400, detail="Họ tên không được để trống")

        if len(password) < 8:
            raise HTTPException(status_code=400, detail="Mật khẩu phải có ít nhất 8 ký tự")

        existing_user = users_collection.find_one({"email": email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email đã tồn tại")

        password_hash = hash_password(password)

        user_doc = {
            "full_name": full_name,
            "email": email,
            "password_hash": password_hash,
            "provider": "local",
            "google_sub": None,
            "avatar": None,
            "created_at": datetime.now(timezone.utc),
        }

        users_collection.insert_one(user_doc)

        access_token = create_access_token({
            "email": email,
            "provider": "local"
        })

        return {
            "message": "Đăng ký thành công",
            "access_token": access_token,
            "user": {
                "full_name": full_name,
                "email": email,
                "provider": "local",
                "avatar": None
            }
        }

    except HTTPException:
        raise
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    except Exception as e:
        print("REGISTER ERROR:", str(e))
        raise HTTPException(status_code=500, detail=f"Lỗi server khi đăng ký: {str(e)}")


@router.post("/login")
def login(payload: LoginRequest):
    try:
        email = payload.email.strip().lower()
        password = payload.password.strip()

        user = users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")

        if user.get("provider") == "google" and not user.get("password_hash"):
            raise HTTPException(
                status_code=400,
                detail="Tài khoản này đã đăng ký bằng Google"
            )

        if not verify_password(password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")

        access_token = create_access_token({
            "email": user["email"],
            "provider": user["provider"]
        })

        return {
            "message": "Đăng nhập thành công",
            "access_token": access_token,
            "user": {
                "full_name": user["full_name"],
                "email": user["email"],
                "provider": user["provider"],
                "avatar": user.get("avatar")
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        print("LOGIN ERROR:", str(e))
        raise HTTPException(status_code=500, detail=f"Lỗi server khi đăng nhập: {str(e)}")


@router.post("/google")
def google_auth(payload: GoogleAuthRequest):
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Thiếu GOOGLE_CLIENT_ID trong backend")

    try:
        idinfo = id_token.verify_oauth2_token(
            payload.credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
    except Exception as e:
        print("GOOGLE VERIFY ERROR:", str(e))
        raise HTTPException(status_code=401, detail=f"Google token không hợp lệ: {str(e)}")

    email = idinfo.get("email")
    full_name = idinfo.get("name")
    google_sub = idinfo.get("sub")
    avatar = idinfo.get("picture")

    if not email:
        raise HTTPException(status_code=400, detail="Không lấy được email từ Google")

    email = email.strip().lower()
    user = users_collection.find_one({"email": email})

    if not user:
        user_doc = {
            "full_name": full_name,
            "email": email,
            "password_hash": None,
            "provider": "google",
            "google_sub": google_sub,
            "avatar": avatar,
            "created_at": datetime.now(timezone.utc),
        }
        users_collection.insert_one(user_doc)
        user = user_doc
    else:
        users_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "google_sub": google_sub,
                    "avatar": avatar
                }
            }
        )
        user = users_collection.find_one({"email": email})

    access_token = create_access_token({
        "email": email,
        "provider": user["provider"]
    })

    return {
        "message": "Đăng nhập Google thành công",
        "access_token": access_token,
        "user": {
            "full_name": user["full_name"],
            "email": user["email"],
            "provider": user["provider"],
            "avatar": user.get("avatar")
        }
    }


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest):
    email = payload.email.strip().lower()
    user = users_collection.find_one({"email": email})

    # Không tiết lộ email có tồn tại hay không
    if not user:
        return {"message": "Nếu email tồn tại, link đặt lại mật khẩu đã được gửi"}

    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    users_collection.update_one(
        {"email": email},
        {
            "$set": {
                "reset_token": reset_token,
                "reset_token_expires": expires_at,
            }
        }
    )

    reset_link = f"{RESET_PASSWORD_URL}?token={reset_token}"

    try:
        send_reset_password_email(email, reset_link)
    except Exception as e:
        print("SEND RESET EMAIL ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Gửi email đặt lại mật khẩu thất bại: {str(e)}"
        )

    return {"message": "Nếu email tồn tại, link đặt lại mật khẩu đã được gửi"}





@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest):
    try:
        token = payload.token.strip()
        new_password = payload.new_password.strip()

        if len(new_password) < 8:
            raise HTTPException(status_code=400, detail="Mật khẩu phải có ít nhất 8 ký tự")

        user = users_collection.find_one({"reset_token": token})

        if not user:
            raise HTTPException(status_code=400, detail="Token không hợp lệ")

        expires_at = user.get("reset_token_expires")
        if not expires_at:
            raise HTTPException(status_code=400, detail="Token không hợp lệ")

        now_utc = datetime.now(timezone.utc)

        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at < now_utc:
            raise HTTPException(status_code=400, detail="Token đã hết hạn")

        new_password_hash = hash_password(new_password)

        users_collection.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "password_hash": new_password_hash
                },
                "$unset": {
                    "reset_token": "",
                    "reset_token_expires": ""
                }
            }
        )

        return {"message": "Đặt lại mật khẩu thành công"}

    except HTTPException:
        raise
    except Exception as e:
        print("RESET PASSWORD ERROR:", repr(e))
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi server reset password: {str(e)}"
        )


@router.post("/change-password")
def change_password(payload: ChangePasswordRequest):
    email = payload.email.strip().lower()
    old_password = payload.old_password.strip()
    new_password = payload.new_password.strip()

    if len(new_password) < 8:
        raise HTTPException(status_code=400, detail="Mật khẩu mới phải có ít nhất 8 ký tự")

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

    if user.get("provider") == "google" and not user.get("password_hash"):
        raise HTTPException(
            status_code=400,
            detail="Tài khoản Google không có mật khẩu local để đổi"
        )

    if not verify_password(old_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Mật khẩu cũ không đúng")

    users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password_hash": hash_password(new_password)
            }
        }
    )

    return {"message": "Đổi mật khẩu thành công"}