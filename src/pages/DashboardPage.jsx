import React from "react";
import { logout } from "../database/firestoreService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

  const boxVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: {
      scale: 1.05,
      boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
      transition: { duration: 0.3 },
    },
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="p-6 flex flex-col gap-6 min-h-screen"
      style={{
        background: "#FFB86C", // medium orange page background
        color: "#1F2937",
      }}
    >
      {/* Glass-like title bar with animated shine */}
      <motion.header
        className="flex items-center justify-between p-4 rounded-xl shadow-lg relative overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        {/* Animated shine overlay */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.2) 100%)",
            transform: "skewX(-20deg)",
            animation: "shineMove 3s linear infinite",
          }}
        />

        <h1 className="text-2xl font-extrabold text-white drop-shadow-lg flex items-center gap-2 relative z-10">
          🍴 <span>Canteen Dashboard</span>
        </h1>
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 rounded-md bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-2 font-semibold text-white shadow-md hover:shadow-lg transition"
        >
          Log Out
        </motion.button>
      </motion.header>

      {/* Dashboard Sections */}
      <main className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {boxes.map((box, idx) => (
          <motion.div
            key={idx}
            variants={boxVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: idx * 0.1 }}
            className="relative h-52 rounded-2xl flex flex-col items-center justify-center text-center overflow-hidden"
            style={{
              // Very light orange gradient box background
              background: "linear-gradient(135deg, #FFF7ED, #FFD4A5)",
              border: "3px solid #8B0000", // very dark red border
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)", // shadow for all boxes
            }}
          >
            {/* Light frame under box */}
            <motion.div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-3 rounded-full blur-lg"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,165,0,0.4), transparent)",
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Box content */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border border-orange-300 rounded-lg mb-3 flex items-center justify-center bg-orange-50 text-3xl">
                {box.emoji}
              </div>
              <h2 className="text-xl font-semibold text-orange-700">{box.title}</h2>
              <p className="text-gray-700">{box.desc}</p>
            </div>
          </motion.div>
        ))}
      </main>

      <footer className="mt-10 text-center text-orange-800 text-sm opacity-80">
        © {new Date().getFullYear()} Canteen Management — All Rights Reserved
      </footer>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes shineMove {
            0% { transform: translateX(-100%) skewX(-20deg); }
            100% { transform: translateX(200%) skewX(-20deg); }
          }
        `}
      </style>
    </motion.div>
  );
};

export default DashboardPage;
