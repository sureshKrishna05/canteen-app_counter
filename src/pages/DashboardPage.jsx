import React, { useState, useEffect, useCallback } from "react";
import { logout, getMyCanteen, toggleCanteenStatus } from "../database/supabaseService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const canteenId = profile?.canteen_id;

  const [canteen, setCanteen] = useState(null);
  const [loadingCanteen, setLoadingCanteen] = useState(!!canteenId);
  const [toggling, setToggling] = useState(false);

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
      setLoadingCanteen(false);
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
    { emoji: "📦", title: "New Orders",        desc: "Incoming paid orders to accept",  path: "/orders",     accent: "#E8F0FE", accentText: "#1A56DB" },
    { emoji: "🍳", title: "Processing Orders",  desc: "Orders currently being prepared", path: "/processing", accent: "#E3F9F0", accentText: "#0E9F6E" },
    { emoji: "✅", title: "Ready Orders",        desc: "Orders ready for pickup",         path: "/ready",      accent: "#FDF6E3", accentText: "#C27803" },
    { emoji: "🚚", title: "Delivered Orders",    desc: "Completed and served orders",     path: "/delivered",  accent: "#F3F0FF", accentText: "#7E3AF2" },
    { emoji: "🍽️", title: "Menu Management",    desc: "Add / edit / remove menu items",  path: "/menu",       accent: "#FDE8E8", accentText: "#C81E1E" },
    { emoji: "📊", title: "Waste Analyse",     desc: "Waste Analysis, Smarter Future.",  path: "/waste",    accent: "#F0FDF4", accentText: "#057A55" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F7F8FA",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      padding: 0,
    }}>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes steam1 {
          0%   { transform: translateY(0) scaleX(1);   opacity: 0.7; }
          50%  { transform: translateY(-10px) scaleX(1.3); opacity: 0.4; }
          100% { transform: translateY(-20px) scaleX(0.8); opacity: 0; }
        }
        @keyframes steam2 {
          0%   { transform: translateY(0) scaleX(1);   opacity: 0.6; }
          50%  { transform: translateY(-12px) scaleX(0.9); opacity: 0.3; }
          100% { transform: translateY(-22px) scaleX(1.2); opacity: 0; }
        }
        @keyframes steam3 {
          0%   { transform: translateY(0) scaleX(1);   opacity: 0.5; }
          50%  { transform: translateY(-8px) scaleX(1.1); opacity: 0.25; }
          100% { transform: translateY(-18px) scaleX(0.9); opacity: 0; }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes flame {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          25%       { transform: scaleY(1.08) scaleX(0.95); }
          75%       { transform: scaleY(0.94) scaleX(1.06); }
        }
        @keyframes ladleSwing {
          0%, 100% { transform: rotate(-10deg); }
          50%       { transform: rotate(10deg); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95%            { transform: scaleY(0.1); }
        }
        @keyframes slidePlate {
          0%   { transform: translateX(30px); opacity: 0; }
          20%  { transform: translateX(0);    opacity: 1; }
          80%  { transform: translateX(0);    opacity: 1; }
          100% { transform: translateX(-30px);opacity: 0; }
        }
        @keyframes trayBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-3px); }
        }
        .nav-card {
          transition: box-shadow 0.18s, border-color 0.18s, transform 0.18s;
        }
        .nav-card:hover {
          box-shadow: 0 6px 28px rgba(0,0,0,0.09) !important;
          border-color: #D1D5DB !important;
          transform: translateY(-3px) !important;
        }
        .logout-btn:hover { background: #F9FAFB !important; }
      `}</style>

      {/* ── Sticky Navbar ─────────────────────────────────────────────── */}
      <header style={{
        background: "#ffffff",
        borderBottom: "1px solid #E5E7EB",
        padding: "0 2rem",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36,
            background: "#111827",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>🍴</div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#111827", letterSpacing: "-0.4px" }}>
              Smart Canteen
            </span>
            {!loadingCanteen && canteen && (
              <span style={{ fontSize: 13, color: "#6B7280", marginLeft: 10 }}>
                {canteen.name}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

          {!loadingCanteen && canteen && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: canteen.is_open ? "#F0FDF4" : "#FEF2F2",
              border: `1px solid ${canteen.is_open ? "#BBF7D0" : "#FECACA"}`,
              borderRadius: 99,
              padding: "4px 12px",
              fontSize: 13, fontWeight: 500,
              color: canteen.is_open ? "#15803D" : "#DC2626",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: canteen.is_open ? "#22C55E" : "#EF4444",
                display: "inline-block",
                animation: canteen.is_open ? "pulse 2s infinite" : "none",
              }} />
              {canteen.is_open ? "Open" : "Closed"}
            </div>
          )}

          {profile && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: 99,
              padding: "5px 14px 5px 6px",
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "#111827", color: "#fff",
                fontSize: 11, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center",
                textTransform: "uppercase", letterSpacing: "0.5px",
              }}>
                {(profile.full_name || "A")[0]}
              </div>
              <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
                {profile.full_name || "Admin"}
              </span>
              <span style={{
                fontSize: 11, color: "#9CA3AF",
                background: "#F3F4F6",
                borderRadius: 4, padding: "1px 6px",
              }}>
                {profile.role}
              </span>
            </div>
          )}

          {canteen && !loadingCanteen && (
            <button
              onClick={handleToggleCanteen}
              disabled={toggling}
              style={{
                fontSize: 13, fontWeight: 500,
                padding: "8px 18px",
                borderRadius: 8,
                border: "1px solid",
                cursor: toggling ? "not-allowed" : "pointer",
                opacity: toggling ? 0.6 : 1,
                transition: "all 0.15s",
                background: canteen.is_open ? "#FEF2F2" : "#F0FDF4",
                color: canteen.is_open ? "#DC2626" : "#15803D",
                borderColor: canteen.is_open ? "#FECACA" : "#BBF7D0",
              }}
            >
              {toggling ? "Updating…" : canteen.is_open ? "Close Canteen" : "Open Canteen"}
            </button>
          )}

          <button
            onClick={handleLogout}
            className="logout-btn"
            style={{
              fontSize: 13, fontWeight: 500,
              padding: "8px 18px",
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              background: "#ffffff",
              color: "#374151",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            Log out
          </button>
        </div>
      </header>

      {/* ── Page Body ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 2rem" }}>

        {/* Heading */}
        <div style={{ marginBottom: "1.75rem", animation: "fadeSlideUp 0.35s ease both" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.5px" }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 0" }}>
            {loadingCanteen
              ? "Loading canteen data…"
              : canteen
              ? `Managing ${canteen.name}`
              : "Welcome back"}
          </p>
        </div>

        {/* No canteen warning */}
        {!canteenId && !loadingCanteen && (
          <div style={{
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 10,
            padding: "14px 18px",
            fontSize: 14, color: "#92400E",
            marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: 10,
            animation: "fadeSlideUp 0.3s ease both",
          }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            Your account is not assigned to a canteen yet. Ask your admin to assign you a canteen.
          </div>
        )}

        {/* ── Canteen Animation Banner ───────────────────────────────── */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: 16,
          marginBottom: "1.75rem",
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          animation: "fadeSlideUp 0.4s ease 0.05s both",
          position: "relative",
        }}>
          <div style={{ zIndex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
              Kitchen is {canteen?.is_open ? "live & cooking! 🔥" : "currently closed."}
            </p>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
              {canteen?.is_open
                ? "Orders are being accepted and prepared right now."
                : "Toggle open to start accepting orders."}
            </p>
          </div>

          <svg
            width="320" height="110"
            viewBox="0 0 320 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <rect x="10" y="72" width="300" height="12" rx="4" fill="#E5E7EB" />
            <rect x="10" y="82" width="300" height="20" rx="4" fill="#D1D5DB" />
            <rect x="30" y="44" width="70" height="30" rx="6" fill="#374151" />
            <rect x="34" y="48" width="62" height="22" rx="4" fill="#4B5563" />
            <g style={{ transformOrigin: "65px 50px", animation: "flame 0.6s ease-in-out infinite" }}>
              <ellipse cx="55" cy="52" rx="5" ry="7" fill="#FB923C" />
              <ellipse cx="55" cy="54" rx="3" ry="4" fill="#FCD34D" />
              <ellipse cx="75" cy="52" rx="5" ry="7" fill="#FB923C" />
              <ellipse cx="75" cy="54" rx="3" ry="4" fill="#FCD34D" />
            </g>
            <g style={{ animation: "bob 2s ease-in-out infinite" }}>
              <rect x="42" y="30" width="46" height="26" rx="6" fill="#6B7280" />
              <rect x="38" y="37" width="54" height="6" rx="3" fill="#9CA3AF" />
              <rect x="36" y="33" width="6" height="10" rx="3" fill="#9CA3AF" />
              <rect x="88" y="33" width="6" height="10" rx="3" fill="#9CA3AF" />
              <circle cx="65" cy="30" r="4" fill="#9CA3AF" />
              <path d="M52 28 Q54 22 52 16" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round"
                style={{ animation: "steam1 1.6s ease-out infinite" }} />
              <path d="M65 26 Q67 20 65 14" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round"
                style={{ animation: "steam2 1.6s ease-out infinite 0.4s" }} />
              <path d="M78 28 Q80 22 78 16" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round"
                style={{ animation: "steam3 1.6s ease-out infinite 0.8s" }} />
            </g>
            <g style={{ animation: "bob 3s ease-in-out infinite 0.5s" }}>
              <rect x="148" y="4" width="24" height="16" rx="4" fill="#ffffff" stroke="#E5E7EB" strokeWidth="1" />
              <rect x="144" y="18" width="32" height="5" rx="2" fill="#ffffff" stroke="#E5E7EB" strokeWidth="1" />
              <circle cx="160" cy="30" r="12" fill="#FDE68A" />
              <g style={{ transformOrigin: "155px 29px", animation: "blink 3s infinite" }}>
                <circle cx="155" cy="29" r="2" fill="#374151" />
              </g>
              <g style={{ transformOrigin: "165px 29px", animation: "blink 3s infinite 0.1s" }}>
                <circle cx="165" cy="29" r="2" fill="#374151" />
              </g>
              <path d="M155 34 Q160 38 165 34" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <rect x="148" y="42" width="24" height="28" rx="6" fill="#ffffff" stroke="#E5E7EB" strokeWidth="1" />
              <rect x="153" y="45" width="14" height="22" rx="3" fill="#BFDBFE" />
              <rect x="136" y="44" width="14" height="7" rx="3.5" fill="#FDE68A" />
              <rect x="170" y="44" width="14" height="7" rx="3.5" fill="#FDE68A" />
            </g>
            <g style={{ transformOrigin: "184px 51px", animation: "ladleSwing 2s ease-in-out infinite" }}>
              <rect x="182" y="44" width="4" height="22" rx="2" fill="#9CA3AF" />
              <ellipse cx="184" cy="68" rx="6" ry="4" fill="#6B7280" />
            </g>
            <g style={{ animation: "slidePlate 4s ease-in-out infinite" }}>
              <ellipse cx="260" cy="70" rx="28" ry="6" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1" />
              <ellipse cx="260" cy="68" rx="18" ry="4" fill="#FEF9C3" />
              <circle cx="254" cy="67" r="4" fill="#FB923C" />
              <circle cx="263" cy="66" r="3" fill="#86EFAC" />
              <circle cx="270" cy="67" r="3.5" fill="#FCA5A5" />
            </g>
            <g style={{ animation: "trayBounce 2.5s ease-in-out infinite 1s" }}>
              <rect x="228" y="66" width="64" height="5" rx="2.5" fill="#D1D5DB" />
            </g>
            <g style={{ animation: "pulse 2s ease-in-out infinite" }}>
              <text x="108" y="20" fontSize="10" fill="#FCD34D">✦</text>
              <text x="200" y="14" fontSize="8" fill="#A5B4FC">✦</text>
              <text x="295" y="30" fontSize="10" fill="#86EFAC">✦</text>
            </g>
          </svg>
        </div>

        {/* ── TODAY'S REVENUE — UI only, added here ─────────────────── */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: 14,
          padding: "1.25rem 1.5rem",
          marginBottom: "1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          animation: "fadeSlideUp 0.4s ease 0.08s both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44,
              background: "#F0FDF4",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
            }}>
              💰
            </div>
            <div>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>
                Today's Revenue
              </p>
              <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.5px" }}>
                ₹0.00
              </p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>
              Orders Delivered
            </p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.5px" }}>
              0
            </p>
          </div>
        </div>

        {/* ── Nav Cards Grid ─────────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}>
          {boxes.map((box, idx) => (
            <div
              key={idx}
              className="nav-card"
              onClick={() => navigate(box.path)}
              style={{
                background: "#ffffff",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: "1.5rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                userSelect: "none",
                animation: `fadeSlideUp 0.4s ease ${0.1 + idx * 0.06}s both`,
              }}
            >
              <div style={{
                width: 44, height: 44,
                background: box.accent,
                borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>
                {box.emoji}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "0 0 5px", letterSpacing: "-0.2px" }}>
                  {box.title}
                </p>
                <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0, lineHeight: 1.55 }}>
                  {box.desc}
                </p>
              </div>

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderTop: "1px solid #F3F4F6",
                paddingTop: 12,
                fontSize: 13, fontWeight: 500,
                color: box.accentText,
              }}>
                <span>View {box.title}</span>
                <span style={{ fontSize: 16 }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer style={{
        textAlign: "center",
        fontSize: 12,
        color: "#D1D5DB",
        padding: "2rem 0 1.5rem",
      }}>
        © {new Date().getFullYear()} Smart Canteen — All Rights Reserved
      </footer>
    </div>
  );
};

export default DashboardPage;