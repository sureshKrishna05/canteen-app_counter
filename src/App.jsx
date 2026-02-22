import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // 🟢 Import your Auth Context

// Import all pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import ProcessingOrdersPage from "./pages/ProcessingOrdersPage";
import ReadyOrdersPage from "./pages/ReadyOrdersPage";
import DeliveredOrdersPage from "./pages/DeliveredOrdersPage";

function App() {
  // 🟢 Grab the current user from Supabase
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-200 to-orange-300">
      <Routes>
        {/* ========================================== */}
        {/* PUBLIC ROUTES (Only visible if NOT logged in) */}
        {/* ========================================== */}
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        <Route 
          path="/signup" 
          element={currentUser ? <Navigate to="/dashboard" replace /> : <SignupPage />} 
        />

        {/* ========================================== */}
        {/* PROTECTED ROUTES (Only visible IF logged in) */}
        {/* ========================================== */}
        <Route 
          path="/dashboard" 
          element={currentUser ? <DashboardPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/orders" 
          element={currentUser ? <OrdersPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/processing" 
          element={currentUser ? <ProcessingOrdersPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/ready" 
          element={currentUser ? <ReadyOrdersPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/delivered" 
          element={currentUser ? <DeliveredOrdersPage /> : <Navigate to="/login" replace />} 
        />

        {/* ========================================== */}
        {/* FALLBACK ROUTE */}
        {/* ========================================== */}
        <Route 
          path="*" 
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </div>
  );
}

export default App;