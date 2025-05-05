import React, { useState } from "react";
import axios from "axios";

function AdminLoginPage({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://student-report-with-secured-adminpanel.onrender.com/login/",
        new URLSearchParams({ password })
      );
      const token = response.data.access_token;
      localStorage.setItem("admin_token", token);
      onLoginSuccess();
    } catch (err) {
      setError("رمز عبور اشتباه است.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl mb-4">ورود به پنل ادمین</h1>
      <input
        type="password"
        placeholder="رمز عبور"
        className="p-2 border rounded mb-2 w-64"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="p-2 bg-blue-500 text-white rounded w-64"
      >
        ورود
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default AdminLoginPage;
