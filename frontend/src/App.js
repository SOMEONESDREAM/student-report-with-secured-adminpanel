import { useState } from "react";

function App() {
  const [code, setCode] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const handleFetchImage = async () => {
    if (!code) return;
    try {
      const response = await fetch(`https://student-report-0rfh.onrender.com/get-image/${code}`);

      if (response.ok) {
        const timestamp = new Date().getTime();
        setImageUrl(`${response.url}?t=${timestamp}`); // جلوگیری از کش شدن
      } else {
        setImageUrl(null);
        alert("کد ملی وارد شده صحیح نمی باشد.");
      }
    } catch (error) {
      console.error("خطا در دریافت کارنامه:", error);
      alert("مشکلی پیش آمد، لطفاً دوباره امتحان کنید.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
      <h1>جستجوی کارنامه</h1>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="کد ملی را وارد کنید."
        style={{ padding: "10px", fontSize: "16px", width: "200px" }}
      />
      <button
        onClick={handleFetchImage}
        style={{ marginLeft: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        جستجو
      </button>

      {imageUrl && (
        <div style={{ marginTop: "30px" }}>
          <h3> </h3>
          <img
            src={imageUrl}
            alt="Result"
            style={{ maxWidth: "90%", maxHeight: "400px", border: "1px solid #ccc", borderRadius: "10px" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
