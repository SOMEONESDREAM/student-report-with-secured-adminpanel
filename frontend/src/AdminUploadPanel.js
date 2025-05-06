import React, { useState } from "react";

function AdminUploadPanel() {
  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);

  const handleExcelUpload = async () => {
    const formData = new FormData();
    formData.append("file", excelFile);

    const response = await fetch("https://report-with-admin-panel.onrender.com/admin/upload-excel/", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();
    alert(data.message || "Upload failed");
  };

  const handleZipUpload = async () => {
    const formData = new FormData();
    formData.append("file", zipFile);

    const response = await fetch("https://report-with-admin-panel.onrender.com/admin/upload-images/", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();
    alert(data.message || "Upload failed");
  };

  return (
    <div>
      <h3>Upload Excel</h3>
      <input type="file" onChange={(e) => setExcelFile(e.target.files[0])} />
      <button onClick={handleExcelUpload}>Upload Excel</button>

      <h3>Upload ZIP of Images</h3>
      <input type="file" onChange={(e) => setZipFile(e.target.files[0])} />
      <button onClick={handleZipUpload}>Upload Images</button>
    </div>
  );
}

export default AdminUploadPanel;
