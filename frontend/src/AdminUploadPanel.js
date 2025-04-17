import React, { useState } from "react";
import axios from "axios";

function AdminUploadPanel() {
  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleExcelUpload = async () => {
    if (!excelFile) {
      setMessage("لطفاً یک فایل اکسل انتخاب کنید.");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      await axios.post(
        "https://student-report-backend.onrender.com/upload-excel/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage("فایل اکسل با موفقیت آپلود شد.");
    } catch (error) {
      setMessage("خطا در آپلود فایل اکسل.");
    }
  };

  const handleZipUpload = async () => {
    if (!zipFile) {
      setMessage("لطفاً یک فایل ZIP انتخاب کنید.");
      return;
    }

    const formData = new FormData();
    formData.append("file", zipFile);

    try {
      await axios.post(
        "https://student-report-backend.onrender.com/upload-images/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage("فایل تصاویر با موفقیت آپلود و استخراج شد.");
    } catch (error) {
      setMessage("خطا در آپلود فایل زیپ تصاویر.");
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <h4>آپلود فایل اکسل</h4>
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setExcelFile(e.target.files[0])}
      />
      <button onClick={handleExcelUpload} style={{ margin: "0.5rem" }}>
        آپلود اکسل
      </button>

      <h4>آپلود فایل ZIP تصاویر</h4>
      <input
        type="file"
        accept=".zip"
        onChange={(e) => setZipFile(e.target.files[0])}
      />
      <button onClick={handleZipUpload} style={{ margin: "0.5rem" }}>
        آپلود تصاویر
      </button>

      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
    </div>
  );
}

export default AdminUploadPanel;
