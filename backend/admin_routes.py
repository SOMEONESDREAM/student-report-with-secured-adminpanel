from fastapi import APIRouter, UploadFile, File
import os
import shutil
import zipfile

router = APIRouter()

# مسیرها
EXCEL_PATH = "data.xlsx"
IMAGES_DIR = "images"
ZIP_PATH = "temp_images.zip"

@router.post("/upload-excel/")
async def upload_excel(file: UploadFile = File(...)):
    # حذف فایل اکسل قبلی اگر وجود دارد
    if os.path.exists(EXCEL_PATH):
        os.remove(EXCEL_PATH)

    # ذخیره فایل جدید
    with open(EXCEL_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "Excel file uploaded successfully"}

@router.post("/upload-images/")
async def upload_zip(file: UploadFile = File(...)):
    # حذف عکس‌های قبلی اگر پوشه وجود دارد
    if os.path.exists(IMAGES_DIR):
        shutil.rmtree(IMAGES_DIR)
    os.makedirs(IMAGES_DIR, exist_ok=True)

    # ذخیره فایل زیپ موقت
    with open(ZIP_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # اکسترکت کردن فایل زیپ در پوشه تصاویر
    with zipfile.ZipFile(ZIP_PATH, "r") as zip_ref:
        zip_ref.extractall(IMAGES_DIR)

    # حذف فایل زیپ موقت
    os.remove(ZIP_PATH)

    return {"message": "Images uploaded and extracted successfully"}
