import React from "react";
import { logout } from "../database/firestoreService";
import { useNavigate } from "react-router-dom";

// This is a simple placeholder for your dashboard
const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Navigate to login after successful logout
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-orange-600">
          Welcome to the Dashboard!
        </h1>
        <p className="mt-4 text-gray-700">You are successfully logged in.</p>
        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-md bg-orange-500 py-2 font-semibold text-white transition hover:bg-orange-600"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;