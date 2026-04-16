import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import ProcessingOrdersPage from "./pages/ProcessingOrdersPage";
import ReadyOrdersPage from "./pages/ReadyOrdersPage";
import DeliveredOrdersPage from "./pages/DeliveredOrdersPage";
import MenuPage from "./pages/MenuPage";
import Waste from "./pages/Waste";
function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500" />
      </div>
    );
  }

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-200 to-orange-300">
      <Routes>
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <SignupPage />}
        />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/processing" element={<ProtectedRoute><ProcessingOrdersPage /></ProtectedRoute>} />
        <Route path="/ready" element={<ProtectedRoute><ReadyOrdersPage /></ProtectedRoute>} />
        <Route path="/delivered" element={<ProtectedRoute><DeliveredOrdersPage /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
        <Route path="/waste" element={<ProtectedRoute><Waste /></ProtectedRoute>} />

        <Route
          path="*"
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </div>
  );
}

export default App;