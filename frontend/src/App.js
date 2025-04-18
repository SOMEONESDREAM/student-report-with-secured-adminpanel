import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentSearch from "./StudentSearch";
import AdminPage from "./AdminPage";

function App() {
  console.log("Refresh render");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentSearch />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
