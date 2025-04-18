import React, { useState } from "react";
import axios from "axios";

function AdminUploadPanel() {
  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleExcelUpload = async () => {
    if (!excelFile) return;

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      await axios.post(
        "https://report-with-admin-panel-1.onrender.com/upload-excel/",
        formData
      );
      setMessage("فایل اکسل با موفقیت آپلود شد.");
    } catch (err) {
      setMessage("خطا در آپلود فایل اکسل.");
    }
  };

  const handleZipUpload = async () => {
    if (!zipFile) return;

    const formData = new FormData();
    formData.append("file", zipFile);

    try {
      await axios.post(
        "https://report-with-admin-panel-1.onrender.com/upload-images/",
        formData
      );
      setMessage("فایل تصاویر با موفقیت آپلود شد.");
    } catch (err) {
      setMessage("خطا در آپلود فایل تصاویر.");
    }
  };

  return (
    <div>
      <h3>آپلود فایل اکسل</h3>
      <input type="file" accept=".xlsx" onChange={(e) => setExcelFile(e.target.files[0])} />
      <button onClick={handleExcelUpload}>آپلود اکسل</button>

      <h3 style={{ marginTop: "2rem" }}>آپلود فایل زیپ تصاویر کارنامه</h3>
      <input type="file" accept=".zip" onChange={(e) => setZipFile(e.target.files[0])} />
      <button onClick={handleZipUpload}>آپلود تصاویر</button>

      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
    </div>
  );
}

export default AdminUploadPanel;
