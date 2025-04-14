from fastapi import APIRouter, UploadFile, File
import os
import shutil
import zipfile

router = APIRouter()

EXCEL_PATH = "backend/data/data.xlsx"
IMAGES_PATH = "backend/images"

@router.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):
    # حذف فایل قبلی
    if os.path.exists(EXCEL_PATH):
        os.remove(EXCEL_PATH)

    # ذخیره فایل جدید
    with open(EXCEL_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"message": "Excel file uploaded successfully."}

@router.post("/upload-zip")
async def upload_zip(file: UploadFile = File(...)):
    # حذف عکس‌های قبلی
    if os.path.exists(IMAGES_PATH):
        shutil.rmtree(IMAGES_PATH)
    os.makedirs(IMAGES_PATH)

    # ذخیره فایل زیپ موقتی
    temp_zip_path = "temp.zip"
    with open(temp_zip_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # استخراج فایل زیپ
    with zipfile.ZipFile(temp_zip_path, 'r') as zip_ref:
        zip_ref.extractall(IMAGES_PATH)

    os.remove(temp_zip_path)
    return {"message": "Zip file extracted successfully."}
