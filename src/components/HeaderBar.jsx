import React from "react";
import { logout } from "../database/firestoreService";
import { useNavigate } from "react-router-dom";

const HeaderBar = ({ title, icon, actionType = "logout" }) => {
  const navigate = useNavigate();

  const handleAction = async () => {
    if (actionType === "LogOut") {
      try {
        await logout();
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    } else if (actionType === "Back") {
      navigate("/dashboard");
    }
  };

  return (
    <header
      className="flex items-center justify-between p-4 rounded-xl shadow-lg relative overflow-hidden mb-6"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.3)"
      }}
    >
      {/* Shine */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0.25) 100%)",
          transform: "skewX(-20deg)"
        }}
      />

      <h1 className="text-2xl font-extrabold text-white drop-shadow-lg flex items-center gap-2 relative z-10">
        {icon} <span>{title}</span>
      </h1>

      <button
        onClick={handleAction}
        className="relative z-10 rounded-md bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-2 font-semibold text-white shadow-md hover:shadow-lg active:scale-95 transition"
      >
        {actionType === "LogOut" ? "Log Out" : "Back"}
      </button>
    </header>
  );
};

export default HeaderBar;
