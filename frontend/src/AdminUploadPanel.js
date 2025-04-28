import React, { useState } from "react";
import axios from "axios";

function AdminUploadPanel() {
  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUploadExcel = async () => {
    if (!excelFile) return;

    const formData = new FormData();
    formData.append("file", excelFile);
    formData.append("token", localStorage.getItem("admin_token"));

    try {
      const response = await axios.post(
        "https://report-with-admin-panel.onrender.com/upload-excel/",
        formData
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage("خطا در آپلود فایل اکسل");
    }
  };

  const handleUploadImages = async () => {
    if (!zipFile) return;

    const formData = new FormData();
    formData.append("file", zipFile);
    formData.append("token", localStorage.getItem("admin_token"));

    try {
      const response = await axios.post(
        "https://report-with-admin-panel.onrender.com/upload-images/",
        formData
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage("خطا در آپلود تصاویر");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl mb-4">آپلود فایل‌ها</h1>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setExcelFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleUploadExcel}
        className="p-2 bg-green-500 text-white rounded mb-4 w-64"
      >
        آپلود اکسل
      </button>

      <input
        type="file"
        accept=".zip"
        onChange={(e) => setZipFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleUploadImages}
        className="p-2 bg-green-500 text-white rounded mb-4 w-64"
      >
        آپلود تصاویر
      </button>

      {message && <p className="text-blue-600 mt-4">{message}</p>}
    </div>
  );
}

export default AdminUploadPanel;
