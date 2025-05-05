from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
import os
import shutil
import zipfile
from datetime import datetime, timedelta

router = APIRouter()

# مسیرها
EXCEL_PATH = "data.xlsx"
IMAGES_DIR = "images"
ZIP_PATH = "temp_images.zip"

# اطلاعات ورود
ADMIN_PASSWORD = "milad123"  # اینجا پسورد دلخواهت رو بذار
ACCESS_TOKEN = None
TOKEN_EXPIRE_TIME = None

@router.post("/login/")
async def login(password: str = Form(...)):
    global ACCESS_TOKEN, TOKEN_EXPIRE_TIME
    if password == ADMIN_PASSWORD:
        ACCESS_TOKEN = "my_secure_token"
        TOKEN_EXPIRE_TIME = datetime.utcnow() + timedelta(minutes=30)
        return {"access_token": ACCESS_TOKEN}
    else:
        raise HTTPException(status_code=401, detail="Invalid password")

def verify_token(token: str):
    if token != ACCESS_TOKEN or datetime.utcnow() > TOKEN_EXPIRE_TIME:
        raise HTTPException(status_code=401, detail="Unauthorized")

@router.post("/upload-excel/")
async def upload_excel(file: UploadFile = File(...), token: str = Form(...)):
    verify_token(token)

    if os.path.exists(EXCEL_PATH):
        os.remove(EXCEL_PATH)

    os.makedirs(os.path.dirname(EXCEL_PATH), exist_ok=True)
    with open(EXCEL_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "Excel file uploaded successfully"}

@router.post("/upload-images/")
async def upload_zip(file: UploadFile = File(...), token: str = Form(...)):
    verify_token(token)

    if os.path.exists(IMAGES_DIR):
        shutil.rmtree(IMAGES_DIR)
    os.makedirs(IMAGES_DIR, exist_ok=True)

    with open(ZIP_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    with zipfile.ZipFile(ZIP_PATH, "r") as zip_ref:
        zip_ref.extractall(IMAGES_DIR)

    os.remove(ZIP_PATH)

    return {"message": "Images uploaded and extracted successfully"}
