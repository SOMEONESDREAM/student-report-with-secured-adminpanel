import React, { useState } from "react";

function AdminLoginPanel({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://student-report-with-secured-adminpanel.onrender.com/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",  // این مهم است: اجازه می‌دهد کوکی دریافت شود
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        onLoginSuccess(); // هدایت به صفحه آپلود یا هر اقدامی
      } else {
        const data = await response.json();
        setError(data.detail || "ورود ناموفق بود");
      }
    } catch (err) {
      setError("خطایی در ارتباط با سرور رخ داد");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4 text-center">ورود مدیر</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          ورود
        </button>
      </form>
    </div>
  );
}

export default AdminLoginPanel;
