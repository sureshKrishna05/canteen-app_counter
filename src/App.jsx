import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* Redirect everything else to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
