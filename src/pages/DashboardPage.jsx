import React from "react";
import { logout } from "../database/firestoreService";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";

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

  // ---------------------------------------
  // Navigation Handler using SWITCH-CASE
  // ---------------------------------------
  const handleNavigation = (title) => {
    switch (title) {
      case "Orders":
        navigate("/orders");
        break;

      case "Processing Orders":
        navigate("/processing");
        break;

      case "Ready Orders":
        navigate("/ready");
        break;

      case "Delivered Orders":
        navigate("/delivered");
        break;

      case "Today’s Menu":
        alert("Menu Management page not created yet.");
        break;

      case "Notifications":
        alert("Notifications page not created yet.");
        break;

      default:
        console.warn("Unknown dashboard box clicked:", title);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen">

      {/* Glass Header */}
        <HeaderBar title="Canteen Dashboard" icon="🍴" actionType="LogOut" />

      {/* Dashboard Boxes */}
      <main className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {boxes.map((box, idx) => (
          <div
            key={idx}
            onClick={() => handleNavigation(box.title)}
            className="relative h-52 rounded-2xl flex flex-col items-center justify-center text-center overflow-hidden transform transition hover:scale-105 hover:shadow-2xl cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #FFF7ED, #FFD4A5)",
              border: "3px solid #8B0000",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
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
