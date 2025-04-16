from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from fastapi import FastAPI, UploadFile, File
import shutil
import zipfile
from backend.admin_routes import router as admin_router  # اگر فایل بالا رو backend/admin_routes.py ساختی

app = FastAPI()


app.include_router(admin_routes.router)

#برای دریافت فایل اکسل و حذف فایل قبلی
EXCEL_PATH = "backend/data/data.xlsx"

@app.post("/upload-excel/")
async def upload_excel(file: UploadFile = File(...)):
    # حذف فایل قبلی
    if os.path.exists(EXCEL_PATH):
        os.remove(EXCEL_PATH)
    
    # ذخیره فایل جدید
    with open(EXCEL_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"message": "Excel file uploaded successfully"}


#برای دریافت فایل زیپ کارنامه های جدید و حذف قبلی ها
IMAGES_DIR = "backend/images"
ZIP_PATH = "backend/temp_images.zip"

@app.post("/upload-images/")
async def upload_zip(file: UploadFile = File(...)):
    # حذف عکس‌های قبلی
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



# فعال کردن CORS برای فرانت‌ اند
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://student-report-frontend-static.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

excel_path = "data.xlsx"
images_folder = "images"

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.get("/get-image/{code}")
def get_image(code: str):
    if not os.path.exists(excel_path):
        raise HTTPException(status_code=404, detail="Excel file not found")

    df = pd.read_excel(excel_path)
    row = df[df['code'] == int(code)]

    if row.empty:
        raise HTTPException(status_code=404, detail="Code not found")

    image_filename = row.iloc[0]['image']
    image_path = os.path.join(images_folder, image_filename)

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(image_path)
