from fastapi import APIRouter, UploadFile, File
import os
import shutil
import zipfile

router = APIRouter()

UPLOAD_FOLDER = "backend/images/"
EXCEL_PATH = "backend/data/data.xlsx"

@router.post("/upload-excel/")
async def upload_excel(file: UploadFile = File(...)):
    if os.path.exists(EXCEL_PATH):
        os.remove(EXCEL_PATH)
    with open(EXCEL_PATH, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"message": "Excel file uploaded successfully"}

@router.post("/upload-zip/")
async def upload_zip(file: UploadFile = File(...)):
    if os.path.exists(UPLOAD_FOLDER):
        shutil.rmtree(UPLOAD_FOLDER)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    zip_path = "temp.zip"
    with open(zip_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(UPLOAD_FOLDER)
    os.remove(zip_path)
    return {"message": "Images uploaded and extracted successfully"}
