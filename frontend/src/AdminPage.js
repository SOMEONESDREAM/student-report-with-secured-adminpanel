import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminUploadPanel from "./AdminUploadPanel";

const AdminPage = () => {
  const navigate = useNavigate();

  // بررسی وضعیت لاگین با توکن ذخیره‌شده در کوکی (HttpOnly)
  useEffect(() => {
    fetch("https://student-report-with-secured-adminpanel.onrender.com/admin/check-auth", {
      method: "GET",
      credentials: "include", // مهم: برای ارسال کوکی
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/admin-login");
        }
      })
      .catch((err) => {
        console.error("Auth check failed", err);
        navigate("/admin-login");
      });
  }, [navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Panel</h2>
      <AdminUploadPanel />
    </div>
  );
};

export default AdminPage;
