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

function App() {
  const { currentUser, profile, profileLoading } = useAuth();

  // ── Critical: wait for profile fetch before making role decisions ──
  // Without this guard, currentUser is set but profile=null for ~200ms
  // during the async fetch, causing isStaff=false → AccessDenied flash.
  if (profileLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-orange-50">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500" />
      </div>
    );
  }

  const isStaff =
    profile?.role === "canteen_admin" ||
    profile?.role === "college_admin" ||
    profile?.role === "owner";

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) return <Navigate to="/login" replace />;
    if (!isStaff) return <AccessDenied />;
    return children;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-200 to-orange-300">
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <SignupPage />}
        />

        {/* Protected */}
        <Route path="/dashboard"  element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/orders"     element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/processing" element={<ProtectedRoute><ProcessingOrdersPage /></ProtectedRoute>} />
        <Route path="/ready"      element={<ProtectedRoute><ReadyOrdersPage /></ProtectedRoute>} />
        <Route path="/delivered"  element={<ProtectedRoute><DeliveredOrdersPage /></ProtectedRoute>} />
        <Route path="/menu"       element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </div>
  );
}

const AccessDenied = () => {
  const handleLogout = () => {
    import("./database/supabaseService").then((m) => m.logout());
  };
  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4">
      <div className="text-5xl">🚫</div>
      <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
      <p className="text-gray-600">This app is for canteen staff only.</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-orange-500 text-white rounded-lg"
      >
        Log Out
      </button>
    </div>
  );
};

export default App;