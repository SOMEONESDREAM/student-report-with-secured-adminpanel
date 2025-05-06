from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Response, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import zipfile
from datetime import datetime, timedelta
import secrets

router = APIRouter()

EXCEL_PATH = "data.xlsx"
IMAGES_DIR = "images"
ZIP_PATH = "temp_images.zip"

ADMIN_PASSWORD = "milad123"
ACCESS_TOKEN = None
TOKEN_EXPIRE_TIME = None
LOGIN_ATTEMPTS = {}  # {ip_address: [timestamps]}
RATE_LIMIT_TIME = timedelta(minutes=5)
MAX_ATTEMPTS = 5

@router.post("/login/")
async def login(response: Response, request: Request, password: str = Form(...)):
    global ACCESS_TOKEN, TOKEN_EXPIRE_TIME
    
    client_ip = request.client.host
    now = datetime.utcnow()

    # پاک‌سازی تلاش‌های منقضی‌شده
    LOGIN_ATTEMPTS.setdefault(client_ip, [])
    LOGIN_ATTEMPTS[client_ip] = [ts for ts in LOGIN_ATTEMPTS[client_ip] if now - ts < RATE_LIMIT_TIME]

    if len(LOGIN_ATTEMPTS[client_ip]) >= MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Too many login attempts. Please try again later.")

    if password == ADMIN_PASSWORD:
        token = secrets.token_hex(16)
        ACCESS_TOKEN = token
        TOKEN_EXPIRE_TIME = now + timedelta(minutes=30)
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            max_age=1800,
            samesite="Strict",
            secure=True
        )
        return {"message": "Login successful"}
    else:
        LOGIN_ATTEMPTS[client_ip].append(now)
        raise HTTPException(status_code=401, detail="Invalid password")

def verify_token(request: Request):
    global ACCESS_TOKEN, TOKEN_EXPIRE_TIME
    token = request.cookies.get("access_token")
    if not token or token != ACCESS_TOKEN or datetime.utcnow() > TOKEN_EXPIRE_TIME:
        raise HTTPException(status_code=401, detail="Unauthorized")

@router.post("/upload-excel/")
async def upload_excel(request: Request, file: UploadFile = File(...)):
    verify_token(request)

    if os.path.exists(EXCEL_PATH):
        os.remove(EXCEL_PATH)

    with open(EXCEL_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "Excel file uploaded successfully"}

@router.post("/upload-images/")
async def upload_zip(request: Request, file: UploadFile = File(...)):
    verify_token(request)

    if os.path.exists(IMAGES_DIR):
        shutil.rmtree(IMAGES_DIR)
    os.makedirs(IMAGES_DIR, exist_ok=True)

    with open(ZIP_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    with zipfile.ZipFile(ZIP_PATH, "r") as zip_ref:
        zip_ref.extractall(IMAGES_DIR)

    os.remove(ZIP_PATH)

    return {"message": "Images uploaded and extracted successfully"}

@router.get("/logout/")
async def logout(response: Response):
    global ACCESS_TOKEN, TOKEN_EXPIRE_TIME
    ACCESS_TOKEN = None
    TOKEN_EXPIRE_TIME = None
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}