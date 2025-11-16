import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import ProcessingOrdersPage from "./pages/ProcessingOrdersPage";
import ReadyOrdersPage from "./pages/ReadyOrdersPage";
import DeliveredOrdersPage from "./pages/DeliveredOrdersPage";

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-200 to-orange-300">
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/processing" element={<ProcessingOrdersPage />} />
        <Route path="/ready" element={<ReadyOrdersPage />} />
        <Route path="/delivered" element={<DeliveredOrdersPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
