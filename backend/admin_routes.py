from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Request, Response
from fastapi.responses import JSONResponse
import os
import shutil
import zipfile
from datetime import datetime, timedelta

router = APIRouter()

# مسیر فایل‌ها
EXCEL_PATH = "data.xlsx"
IMAGES_DIR = "images"
ZIP_PATH = "temp_images.zip"

# اطلاعات احراز هویت
ADMIN_PASSWORD = "milad123"
ACCESS_TOKEN = "my_secure_token"
TOKEN_EXPIRE_TIME = None

# لاگ تلاش‌های ورود
FAILED_LOGIN_ATTEMPTS = []
MAX_ATTEMPTS = 5
BLOCK_DURATION_MINUTES = 5

def clean_old_attempts():
    global FAILED_LOGIN_ATTEMPTS
    now = datetime.utcnow()
    FAILED_LOGIN_ATTEMPTS = [t for t in FAILED_LOGIN_ATTEMPTS if now - t < timedelta(minutes=BLOCK_DURATION_MINUTES)]

def is_blocked():
    clean_old_attempts()
    return len(FAILED_LOGIN_ATTEMPTS) >= MAX_ATTEMPTS

def verify_token(token: str):
    global TOKEN_EXPIRE_TIME
    if token != ACCESS_TOKEN or not TOKEN_EXPIRE_TIME or datetime.utcnow() > TOKEN_EXPIRE_TIME:
        raise HTTPException(status_code=401, detail="Unauthorized")

@router.post("/login/")
async def login(password: str = Form(...), response: Response = None):
    global TOKEN_EXPIRE_TIME

    if is_blocked():
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again later.")

    if password != ADMIN_PASSWORD:
        FAILED_LOGIN_ATTEMPTS.append(datetime.utcnow())
        raise HTTPException(status_code=401, detail="Invalid password")

    # موفقیت‌آمیز: تنظیم توکن و پاک کردن تلاش‌های قبلی
    FAILED_LOGIN_ATTEMPTS.clear()
    TOKEN_EXPIRE_TIME = datetime.utcnow() + timedelta(minutes=30)

    # تنظیم کوکی HttpOnly
    response.set_cookie(
        key="access_token",
        value=ACCESS_TOKEN,
        httponly=True,
        samesite="none",
        secure=True,  # اگر https فعال است
        max_age=1800
    )

    return {"message": "Login successful"}

@router.get("/check-auth")
async def check_auth(request: Request):
    try:
        verify_token(request)
        return {"status": "authorized"}
    except HTTPException:
        raise HTTPException(status_code=401, detail="Unauthorized")

@router.post("/upload-excel/")
async def upload_excel(file: UploadFile = File(...), request: Request = None):
    token = request.cookies.get("access_token")
    verify_token(token)

    if os.path.exists(EXCEL_PATH):
        os.remove(EXCEL_PATH)

    with open(EXCEL_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "Excel file uploaded successfully"}

@router.post("/upload-images/")
async def upload_zip(file: UploadFile = File(...), request: Request = None):
    token = request.cookies.get("access_token")
    verify_token(token)

    # حذف پوشه قبلی تصاویر
    if os.path.exists(IMAGES_DIR):
        shutil.rmtree(IMAGES_DIR)
    os.makedirs(IMAGES_DIR, exist_ok=True)

    # ذخیره فایل زیپ موقت
    with open(ZIP_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # استخراج تصاویر
    with zipfile.ZipFile(ZIP_PATH, "r") as zip_ref:
        zip_ref.extractall(IMAGES_DIR)

    os.remove(ZIP_PATH)

    return {"message": "Images uploaded and extracted successfully"}
