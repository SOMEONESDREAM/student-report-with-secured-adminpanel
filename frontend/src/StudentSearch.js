import React, { useState } from "react";

function StudentSearch() {
  const [code, setCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!code.trim()) {
      setError("لطفاً یک کد وارد کنید.");
      setImageUrl("");
      return;
    }

    const url = `https://report-with-admin-panel.onrender.com/get-image/${code}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Not found");
      }

      setImageUrl(url);
      setError("");
    } catch (err) {
      setImageUrl("");
      setError("کارنامه‌ای برای این کد یافت نشد.");
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
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt="کارنامه"
            style={{ marginTop: "2rem", maxWidth: "90%" }}
          />
        </div>
      )}
    </div>
  );
}

export default StudentSearch;
