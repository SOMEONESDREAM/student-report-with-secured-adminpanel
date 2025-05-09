from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
from auth import verify_token, create_access_token
import shutil
import os
import os

router = APIRouter(prefix="/admin")

UPLOAD_DIR = "uploads"

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
    response.set_cookie(key="admin_token", value=token, httponly=True, secure=True)
    return response

# ✅ upload excel
@router.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...), user=Depends(verify_token)):
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        file_path = os.path.join(UPLOAD_DIR, "data.xlsx")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return JSONResponse(content={"message": "فایل اکسل با موفقیت آپلود شد"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ upload images
@router.post("/upload-images")
async def upload_images(file: UploadFile = File(...), user=Depends(verify_token)):
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        file_path = os.path.join(UPLOAD_DIR, "images.zip")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return JSONResponse(content={"message": "فایل تصاویر با موفقیت آپلود شد"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
