import React from "react";
import AdminUploadPanel from "./AdminUploadPanel";

const AdminPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">پنل مدیریت مدرسه</h2>
        <AdminUploadPanel />
      </div>
    </div>
  );
};

export default AdminPage;
