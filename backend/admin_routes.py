from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from auth import verify_token  # توکنی که در کوکی است را بررسی می‌کند
import shutil
import os

router = APIRouter(prefix="/admin")

UPLOAD_DIR = "uploads"

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