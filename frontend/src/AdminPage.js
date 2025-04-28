import React, { useState, useEffect } from "react";
import AdminLoginPage from "./AdminLoginPage";
import AdminUploadPanel from "./AdminUploadPanel";

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <AdminUploadPanel />
      ) : (
        <AdminLoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default AdminPage;
