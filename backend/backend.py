from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

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
