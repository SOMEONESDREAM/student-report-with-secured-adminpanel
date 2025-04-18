from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

from admin_routes import router as admin_router  # اگر مسیرت backend/admin_routes.py هست

app = FastAPI()

# اضافه کردن روت‌های مربوط به پنل ادمین
app.include_router(admin_router)

# فعال کردن CORS برای فرانت‌اند روی رندر
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://student-report-frontend-static.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# مسیر فایل‌ها
EXCEL_PATH = "backend/data.xlsx"
IMAGES_FOLDER = "backend/images"

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.get("/get-image/{code}")
def get_image(code: str):
    if not os.path.exists(EXCEL_PATH):
        raise HTTPException(status_code=404, detail="Excel file not found")

    df = pd.read_excel(EXCEL_PATH)
    row = df[df['code'] == int(code)]

    if row.empty:
        raise HTTPException(status_code=404, detail="Code not found")

    image_filename = row.iloc[0]['image']
    image_path = os.path.join(IMAGES_FOLDER, image_filename)

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(image_path)
