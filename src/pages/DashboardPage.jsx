import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* 🔥 ANIMATION SYSTEM */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0 },
};

/* 🔥 PREMIUM SHADOW */
const premiumShadow =
  "shadow-[0_10px_30px_rgba(0,0,0,0.08),0_2px_10px_rgba(0,0,0,0.04)]";

/* 🔥 GLASS CARD */
const Card = ({ title, children }) => (
  <motion.div
    variants={item}
    whileHover={{ y: -8 }}
    className={`backdrop-blur-xl bg-white/60 border border-white/40 rounded-2xl p-5 transition-all duration-300 ${premiumShadow} hover:shadow-[0_20px_50px_rgba(0,0,0,0.12),0_5px_20px_rgba(0,0,0,0.08)]`}
  >
    <h2 className="text-sm font-semibold text-gray-600 mb-4">{title}</h2>
    {children}
  </motion.div>
);

/* 🔥 STAT CARD */
const StatCard = ({ label, value }) => (
  <motion.div
    variants={item}
    whileHover={{ scale: 1.06, y: -4 }}
    className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-orange-400 to-orange-600 text-white"
    style={{
      boxShadow:
        "0 10px 30px rgba(255,120,0,0.25), 0 5px 15px rgba(0,0,0,0.08)",
    }}
  >
    <p className="text-xs opacity-80">{label}</p>
    <h2 className="text-2xl font-bold mt-2">{value}</h2>

    {/* glow */}
    <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/20 blur-3xl rounded-full"></div>
  </motion.div>
);

/* 🔥 HERO */
const Hero = () => (
  <motion.div
    variants={item}
    className="relative rounded-3xl p-6 mb-6 text-white overflow-hidden"
    style={{
      background: "linear-gradient(135deg, #f97316, #ea580c)",
      boxShadow:
        "0 20px 60px rgba(249,115,22,0.35), 0 10px 25px rgba(0,0,0,0.1)",
    }}
  >
    <div className="flex justify-between items-center relative z-10">

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm opacity-90">Main Canteen • Live Operations</p>

        <div className="mt-3 flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          System Running Smoothly
        </div>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
          Close
        </button>
        <button className="px-4 py-2 bg-black/30 rounded-lg hover:bg-black/40 transition">
          Logout
        </button>
      </div>
    </div>

    {/* glow layers */}
    <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/20 blur-3xl rounded-full"></div>
    <div className="absolute top-0 right-0 w-56 h-56 bg-yellow-300/20 blur-3xl rounded-full"></div>
  </motion.div>
);

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-[#F6F1EB] p-6"
    >

      <Hero />

      {/* STATS */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard label="New Orders" value="12" />
        <StatCard label="Processing" value="8" />
        <StatCard label="Ready" value="5" />
        <StatCard label="Revenue" value="₹4,200" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
                {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          <Card title="Order Flow">
            <div className="grid grid-cols-3 gap-4">
              {["New", "Processing", "Ready"].map((label, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08 }}
                  className="p-5 rounded-xl bg-white/70 border text-center cursor-pointer transition"
                  style={{
                    boxShadow:
                      "0 5px 15px rgba(0,0,0,0.05), 0 2px 5px rgba(0,0,0,0.03)",
                  }}
                >
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-xl font-bold mt-1">0</p>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card title="Recent Orders">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ x: 8 }}
                className="flex justify-between items-center p-4 rounded-xl bg-white/70 border cursor-pointer transition"
                style={{
                  boxShadow:
                    "0 6px 18px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
                }}
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    Order #{i}
                  </p>
                  <p className="text-xs text-gray-500">
                    2 items • Paid
                  </p>
                </div>

                <span className="text-orange-600 font-bold">₹120</span>
              </motion.div>
            ))}
          </Card>

          <Card title="Live Activity">
            {[
              "New order received",
              "Order moved to ready",
              "Payment received",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {item}
              </motion.div>
            ))}
          </Card>

        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6">

          <Card title="Quick Actions">
            <div className="flex flex-col gap-3">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/menu")}
                className="p-3 rounded-xl text-white transition"
                style={{
                  background: "linear-gradient(135deg,#f97316,#ea580c)",
                  boxShadow:
                    "0 10px 25px rgba(249,115,22,0.35), 0 4px 10px rgba(0,0,0,0.08)",
                }}
              >
                🍽️ Manage Menu
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/orders")}
                className="p-3 rounded-xl text-white transition"
                style={{
                  background: "#111827",
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,0.3), 0 3px 8px rgba(0,0,0,0.1)",
                }}
              >
                📦 View Orders
              </motion.button>

              {/* 🔥 DELIVERED BUTTON */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/delivered")}
                className="p-3 rounded-xl text-white transition"
                style={{
                  background: "#16a34a",
                  boxShadow:
                    "0 10px 25px rgba(22,163,74,0.35), 0 4px 10px rgba(0,0,0,0.08)",
                }}
              >
                ✅ Delivered Orders
              </motion.button>

            </div>
          </Card>

          <Card title="Today Summary">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Orders</span>
                <span className="font-bold">25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Revenue</span>
                <span className="font-bold text-orange-600">₹4,200</span>
              </div>
            </div>
          </Card>

          <Card title="Top Selling Items">
            {[
              { name: "Veg Thali", count: 32 },
              { name: "Fried Rice", count: 21 },
              { name: "Tea", count: 18 },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04 }}
                className="flex justify-between p-3 rounded-lg bg-white/70 border transition"
                style={{
                  boxShadow:
                    "0 5px 15px rgba(0,0,0,0.05), 0 2px 5px rgba(0,0,0,0.03)",
                }}
              >
                <span>{item.name}</span>
                <span className="text-orange-500 font-bold">
                  {item.count}
                </span>
              </motion.div>
            ))}
          </Card>

        </div>
      </div>

      <div className="text-center mt-10 text-xs text-gray-400">
        © {new Date().getFullYear()} Smart Canteen — Premium UI
      </div>

    </motion.div>
  );
};

export default DashboardPage;