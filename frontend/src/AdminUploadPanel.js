import React, { useState } from 'react';

const AdminUploadPanel = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [message, setMessage] = useState("");

  const backendURL = "https://student-report-0rfh.onrender.com"; // آدرس بک‌اند خودت

  const handleExcelUpload = async () => {
    if (!excelFile) return;

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const res = await fetch(`${backendURL}/admin/upload-excel`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setMessage(result.detail || "Excel uploaded successfully");
    } catch (err) {
      setMessage("خطا در آپلود اکسل");
    }
  };

  const handleZipUpload = async () => {
    if (!zipFile) return;

    const formData = new FormData();
    formData.append("file", zipFile);

    try {
      const res = await fetch(`${backendURL}/admin/upload-zip`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setMessage(result.detail || "Zip uploaded successfully");
    } catch (err) {
      setMessage("خطا در آپلود فایل زیپ");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>پنل مدیریت آپلود</h2>

      <div>
        <label>آپلود فایل اکسل:</label>
        <input type="file" accept=".xlsx" onChange={(e) => setExcelFile(e.target.files[0])} />
        <button onClick={handleExcelUpload}>آپلود اکسل</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>آپلود فایل زیپ عکس‌ها:</label>
        <input type="file" accept=".zip" onChange={(e) => setZipFile(e.target.files[0])} />
        <button onClick={handleZipUpload}>آپلود زیپ</button>
      </div>

      <p style={{ color: 'green' }}>{message}</p>
    </div>
  );
};

export default AdminUploadPanel;
