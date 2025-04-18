import React, { useState } from "react";
import axios from "axios";

function StudentSearch() {
  const [code, setCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://report-with-admin-panel-1.onrender.com/get-image/${code}`
      );
      setImageUrl(response.data);
      setError("");
    } catch (err) {
      setError("کارنامه‌ای برای این کد یافت نشد.");
      setImageUrl("");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>دریافت کارنامه دانش‌آموز</h1>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="کد دانش‌آموز را وارد کنید"
        style={{ padding: "0.5rem", margin: "1rem", fontSize: "1rem" }}
      />
      <button onClick={handleSearch}>جستجو</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="کارنامه" style={{ marginTop: "2rem", maxWidth: "90%" }} />
        </div>
      )}
    </div>
  );
}

export default StudentSearch;
