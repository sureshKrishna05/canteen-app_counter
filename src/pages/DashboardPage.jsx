import React from "react";
import { logout } from "../database/firestoreService";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const boxes = [
    { emoji: "📦", title: "Orders", desc: "View all customer orders" },
    { emoji: "🍳", title: "Processing Orders", desc: "Orders currently being prepared" },
    { emoji: "✅", title: "Ready Orders", desc: "Orders ready for delivery" },
    { emoji: "🚚", title: "Delivered Orders", desc: "Completed and served orders" },
    { emoji: "🍽️", title: "Today’s Menu", desc: "Manage and update daily menu items" },
    { emoji: "🔔", title: "Notifications", desc: "View alerts and recent updates" },
  ];

  return (
    <div
      className="p-6 flex flex-col gap-6 min-h-screen"
      style={{
        background: "#FFB86C",
        color: "#1F2937",
      }}
    >
      {/* Glass-like title bar */}
      <header
        className="flex items-center justify-between p-4 rounded-xl shadow-lg relative overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        {/* Shine effect (static, no animation) */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0.25) 100%)",
            transform: "skewX(-20deg)",
          }}
        />

        <h1 className="text-2xl font-extrabold text-white drop-shadow-lg flex items-center gap-2 relative z-10">
          🍴 <span>Canteen Dashboard</span>
        </h1>

        <button
          onClick={handleLogout}
          className="relative z-10 rounded-md bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-2 font-semibold text-white shadow-md hover:shadow-lg active:scale-95 transition"
        >
          Log Out
        </button>
      </header>

      {/* Dashboard Sections */}
      <main className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {boxes.map((box, idx) => (
          <div
            key={idx}
            className="relative h-52 rounded-2xl flex flex-col items-center justify-center text-center overflow-hidden transform transition hover:scale-105 hover:shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #FFF7ED, #FFD4A5)",
              border: "3px solid #8B0000",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
            {/* Static light frame */}
            <div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-3 rounded-full blur-lg opacity-70"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,165,0,0.4), transparent)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border border-orange-300 rounded-lg mb-3 flex items-center justify-center bg-orange-50 text-3xl">
                {box.emoji}
              </div>
              <h2 className="text-xl font-semibold text-orange-700">{box.title}</h2>
              <p className="text-gray-700">{box.desc}</p>
            </div>
          </div>
        ))}
      </main>

      <footer className="mt-10 text-center text-orange-800 text-sm opacity-80">
        © {new Date().getFullYear()} Canteen Management — All Rights Reserved
      </footer>
    </div>
  );
};

export default DashboardPage;
