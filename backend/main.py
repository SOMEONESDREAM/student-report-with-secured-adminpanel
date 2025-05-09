from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

from admin_routes import router as admin_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://student-report-secured-adminpanel.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_router, prefix="/admin")

EXCEL_PATH = "data.xlsx"
IMAGES_FOLDER = "images"

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
