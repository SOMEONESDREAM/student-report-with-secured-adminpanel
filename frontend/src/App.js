import React, { useState } from 'react';
import axios from 'axios';
import AdminUploadPanel from './AdminUploadPanel';

function App() {
  const [code, setCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://student-report-backend.onrender.com/get-image/${code}`
      );
      setImageUrl(response.request.responseURL);
      setError('');
    } catch (err) {
      setImageUrl('');
      setError('کدی با این مشخصات پیدا نشد یا تصویری وجود ندارد.');
    }
  };

  return (
    <div style={{ direction: 'rtl', textAlign: 'center', marginTop: '50px' }}>
      <h1>سامانه مشاهده کارنامه</h1>
      <input
        type="text"
        placeholder="کد را وارد کنید"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
        style={{ padding: '10px', fontSize: '16px', width: '300px' }}
      />
      <button
        onClick={handleSearch}
        style={{
          padding: '10px 20px',
          marginRight: '10px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        جستجو
      </button>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <img
            src={imageUrl}
            alt="کارنامه"
            style={{ width: '80%', maxWidth: '600px', border: '1px solid #ccc' }}
          />
        </div>
      )}

      <hr style={{ margin: '40px auto', width: '80%' }} />

      {/* 👇 پنل مدیریت برای آپلود فایل اکسل و فایل زیپ تصاویر */}
      <AdminUploadPanel />
    </div>
  );
}

export default App;
