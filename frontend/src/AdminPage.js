import React, { useEffect, useState } from "react";
import AdminUploadPanel from "./AdminUploadPanel";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("https://student-report-with-secured-adminpanel.onrender.com/admin/check-auth", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    fetch("https://student-report-with-secured-adminpanel.onrender.com/admin/login/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          alert("رمز عبور اشتباه است");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("خطا در اتصال به سرور");
      });
  };

  if (isAuthenticated === null) {
    return <div>در حال بررسی وضعیت لاگین...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">ورود مدیر</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-2 w-full"
            placeholder="رمز عبور"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            ورود
          </button>
        </form>
      </div>
    );
  }

  return <AdminUploadPanel />;
};

export default AdminPage;
