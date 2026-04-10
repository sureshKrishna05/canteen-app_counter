import React, { useState, useEffect, useCallback } from "react";
import { logout, getMyCanteen, toggleCanteenStatus } from "../database/supabaseService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const canteenId = profile?.canteen_id; // ✅ Moved UP to use in state/callbacks

  const [canteen, setCanteen] = useState(null);
  const [loadingCanteen, setLoadingCanteen] = useState(!!canteenId); // ✅ Starts false if no ID
  const [toggling, setToggling] = useState(false);

  // ✅ Robust fetch pattern matching the other pages
  const loadCanteen = useCallback(async () => {
    if (!canteenId) {
      setLoadingCanteen(false);
      return;
    }
    
    setLoadingCanteen(true);
    try {
      const data = await getMyCanteen(canteenId);
      setCanteen(data);
    } catch (e) {
      console.error("Failed to load canteen:", e);
    } finally {
      setLoadingCanteen(false); // ✅ Guaranteed to stop loading
    }
  }, [canteenId]);

  useEffect(() => {
    loadCanteen();
  }, [loadCanteen]);

  const handleLogout = async () => {
    try { 
      await logout(); 
      navigate("/login"); 
    } catch (e) { 
      console.error(e); 
    }
  };

  const handleToggleCanteen = async () => {
    if (!canteen) return;
    setToggling(true);
    try {
      const updated = await toggleCanteenStatus(canteen.id, !canteen.is_open);
      setCanteen(updated);
    } catch (e) {
      alert("Failed to update canteen status: " + e.message);
    } finally {
      setToggling(false);
    }
  };

  const boxes = [
    { emoji: "📦", title: "New Orders",         desc: "Incoming paid orders to accept",   path: "/orders",     color: "from-yellow-400 to-orange-400" },
    { emoji: "🍳", title: "Processing Orders",   desc: "Orders currently being prepared",  path: "/processing", color: "from-blue-400 to-cyan-400" },
    { emoji: "✅", title: "Ready Orders",         desc: "Orders ready for pickup",          path: "/ready",      color: "from-green-400 to-emerald-400" },
    { emoji: "🚚", title: "Delivered Orders",     desc: "Completed and served orders",      path: "/delivered",  color: "from-purple-400 to-violet-400" },
    { emoji: "🍽️", title: "Menu Management",     desc: "Add / edit / remove menu items",   path: "/menu",       color: "from-pink-400 to-rose-400" },
    { emoji: "📊", title: "Today's Summary",      desc: "Orders count and revenue",         path: "/summary",    color: "from-amber-400 to-yellow-400" },
  ];

  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen" style={{ background: "#FFB86C" }}>

      {/* Header */}
      <header className="flex items-center justify-between p-4 rounded-xl shadow-lg relative overflow-hidden"
        style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}>
        <div>
          <h1 className="text-2xl font-extrabold text-white drop-shadow flex items-center gap-2">
            🍴 Canteen Counter
          </h1>
          {loadingCanteen ? (
            <p className="text-white/80 text-sm mt-0.5">Loading canteen data...</p>
          ) : canteen ? (
            <p className="text-white/80 text-sm mt-0.5">
              {canteen.name} — 
              <span className={`ml-1 font-semibold ${canteen.is_open ? "text-green-200" : "text-red-200"}`}>
                {canteen.is_open ? "● Open" : "● Closed"}
              </span>
            </p>
          ) : null}
          
          {profile && (
            <p className="text-white/60 text-xs mt-0.5">
              Logged in as: {profile.full_name || "Admin"} ({profile.role})
            </p>
          )}
        </div>

        <div className="flex gap-3">
          {/* ✅ Real canteen open/close toggle */}
          {canteen && !loadingCanteen && (
            <button
              onClick={handleToggleCanteen}
              disabled={toggling}
              className={`px-4 py-2 rounded-lg font-semibold text-white text-sm transition ${
                canteen.is_open
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } disabled:opacity-50`}
            >
              {toggling ? "..." : canteen.is_open ? "Close Canteen" : "Open Canteen"}
            </button>
          )}
          <button onClick={handleLogout}
            className="rounded-md bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-2 font-semibold text-white shadow-md hover:shadow-lg active:scale-95 transition">
            Log Out
          </button>
        </div>
      </header>

      {/* No canteen assigned warning */}
      {!canteenId && !loadingCanteen && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg text-sm">
          ⚠️ Your account is not assigned to a canteen yet. Ask your admin to assign you a canteen.
        </div>
      )}

      {/* Dashboard Grid */}
      <main className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {boxes.map((box, idx) => (
          <div
            key={idx}
            onClick={() => navigate(box.path)}
            className={`relative h-48 rounded-2xl flex flex-col items-center justify-center text-center
              overflow-hidden transform transition hover:scale-105 hover:shadow-2xl cursor-pointer
              bg-gradient-to-br ${box.color} shadow-lg`}
          >
            <div className="absolute inset-0 bg-white/10 rounded-2xl" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="text-4xl mb-3">{box.emoji}</div>
              <h2 className="text-xl font-bold text-white drop-shadow">{box.title}</h2>
              <p className="text-white/80 text-sm mt-1 px-4">{box.desc}</p>
            </div>
          </div>
        ))}
      </main>

      <footer className="mt-auto text-center text-orange-800 text-sm opacity-70">
        © {new Date().getFullYear()} Smart Canteen Counter — All Rights Reserved
      </footer>
    </div>
  );
};

export default DashboardPage;