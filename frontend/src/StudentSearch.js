import React, { useState } from "react";
import axios from "axios";

const StudentSearch = () => {
  const [code, setCode] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!code) {
      setError("لطفاً کد را وارد کنید.");
      setImageUrl(null);
      return;
    }

    try {
      const response = await axios.get(
        `https://student-report-backend.onrender.com/get-image/${code}`
      );
      const blob = new Blob([response.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      setImageUrl(`https://student-report-backend.onrender.com/get-image/${code}`);
      setError(null);
    } catch (err) {
      setImageUrl(null);
      setError("کدی با این مشخصات یافت نشد یا تصویر موجود نیست.");
    }
  };

  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-semibold mb-4">مشاهده کارنامه دانش‌آموز</h2>
      <input
        type="text"
        placeholder="کد دانش‌آموز را وارد کنید"
        className="p-2 border rounded w-64"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        جستجو
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {imageUrl && (
        <div className="mt-6">
          <img src={imageUrl} alt="Student Report" className="max-w-full mx-auto" />
        </div>
      )}
    </div>
  );
};

export default StudentSearch;
