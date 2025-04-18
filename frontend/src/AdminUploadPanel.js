
import axios from "axios";
import React, { useRef } from "react";


const AdminPage = () => {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [message, setMessage] = useState("");

  const correctPassword = "admin123"; // رمز ساده (می‌تونی بعداً پیشرفته‌ترش کنی)

  const handleLogin = () => {
    if (password === correctPassword) {
      setAuth(true);
    } else {
      alert("رمز اشتباه است!");
    }
  };

  const handleExcelUpload = async () => {
    if (!excelFile) return;
    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      await axios.post("https://student-report-backend.onrender.com/upload-excel/", formData);
      setMessage("فایل اکسل با موفقیت آپلود شد");
    } catch (error) {
      setMessage("خطا در آپلود فایل اکسل");
    }
  };

  const handleZipUpload = async () => {
    if (!zipFile) return;
    const formData = new FormData();
    formData.append("file", zipFile);

    try {
      await axios.post("https://student-report-backend.onrender.com/upload-images/", formData);
      setMessage("فایل زیپ با موفقیت آپلود شد");
    } catch (error) {
      setMessage("خطا در آپلود فایل زیپ");
    }
  };

  if (!auth) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>ورود ادمین</h2>
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>ورود</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>پنل ادمین</h2>

      <div>
        <h3>آپلود فایل اکسل</h3>
        <input type="file" accept=".xlsx" onChange={(e) => setExcelFile(e.target.files[0])} />
        <button onClick={handleExcelUpload}>آپلود اکسل</button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>آپلود فایل زیپ کارنامه‌ها</h3>
        <input type="file" accept=".zip" onChange={(e) => setZipFile(e.target.files[0])} />
        <button onClick={handleZipUpload}>آپلود زیپ</button>
      </div>

      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
    </div>
  );
};

export default AdminPage;
