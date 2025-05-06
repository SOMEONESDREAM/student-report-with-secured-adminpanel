import React, { useState, useEffect } from "react";
import AdminUploadPanel from "./AdminUploadPanel";

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const checkAuth = async () => {
    const response = await fetch("https://student-report-with-secured-adminpanel.onrender.com//admin/check-auth", {
      credentials: "include",
    });

    if (response.ok) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async () => {
    const formData = new FormData();
    formData.append("password", password);

    const response = await fetch("https://student-report-with-secured-adminpanel.onrender.com//admin/login/", {
      method: "POST",
      body: formData,
      credentials: "include", // very important for HttpOnly cookie
    });

    if (response.ok) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      const data = await response.json();
      setLoginError(data.detail || "Login failed");
    }
  };

  const handleLogout = async () => {
    await fetch("https://student-report-with-secured-adminpanel.onrender.com//admin/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Admin Login</h2>
        <input
          type="password"
          value={password}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {loginError && <p style={{ color: "red" }}>{loginError}</p>}
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, Admin</h2>
      <button onClick={handleLogout}>Logout</button>
      <AdminUploadPanel />
    </div>
  );
}

export default AdminPage;
