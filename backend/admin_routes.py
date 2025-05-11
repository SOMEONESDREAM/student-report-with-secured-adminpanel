from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
from auth import verify_token, create_access_token
import shutil
import os
import zipfile

router = APIRouter()

# مسیرهای مورد نیاز
EXCEL_PATH = "data.xlsx"
IMAGES_DIR = "images"
TEMP_ZIP_PATH = "temp_images.zip"

# ✅ login endpoint
@router.post("/login")
async def login(request: Request):
    data = await request.json()
    password = data.get("password")

    allowed_password = os.getenv("ALLOWED_PASSWORD")
    if password != allowed_password:
        raise HTTPException(status_code=401, detail="رمز اشتباه است")

    token = create_access_token({"role": "admin"})

    response = JSONResponse(content={"message": "ورود موفقیت‌آمیز بود"})
    response.set_cookie(
        key="admin_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",  # در صورت نیاز می‌توان تنظیم کرد به "lax"
    )
    return response

# ✅ check-auth endpoint — بررسی وضعیت لاگین
@router.get("/check-auth")
async def check_auth(user=Depends(verify_token)):
    return {"message": "Authenticated"}

# ✅ upload excel — ذخیره در ریشه پروژه
@router.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...), user=Depends(verify_token)):
    try:
        # حذف فایل قبلی اگر وجود دارد
        if os.path.exists(EXCEL_PATH):
            os.remove(EXCEL_PATH)

        with open(EXCEL_PATH, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return JSONResponse(content={"message": "فایل اکسل با موفقیت آپلود شد"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ upload images — اکسترکت فایل zip در پوشه images
@router.post("/upload-images")
async def upload_images(file: UploadFile = File(...), user=Depends(verify_token)):
    try:
        # حذف پوشه قبلی تصاویر
        if os.path.exists(IMAGES_DIR):
            shutil.rmtree(IMAGES_DIR)
        os.makedirs(IMAGES_DIR, exist_ok=True)

        # ذخیره فایل zip موقت
        with open(TEMP_ZIP_PATH, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # اکسترکت کردن فایل zip
        with zipfile.ZipFile(TEMP_ZIP_PATH, "r") as zip_ref:
            zip_ref.extractall(IMAGES_DIR)

        # حذف فایل zip موقت
        os.remove(TEMP_ZIP_PATH)

        return JSONResponse(content={"message": "فایل تصاویر با موفقیت اکسترکت شد"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
