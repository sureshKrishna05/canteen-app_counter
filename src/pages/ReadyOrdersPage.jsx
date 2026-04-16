import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrdersByStatus, updateOrderStatus, subscribeToOrders } from "../database/supabaseService";

const ReadyOrdersPage = () => {
  const { profile } = useAuth();
  const canteenId = profile?.canteen_id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(!!canteenId);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    if (!canteenId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getOrdersByStatus(canteenId, ["ready"]);
      setOrders(data);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [canteenId]);

  useEffect(() => {
    loadOrders();
    const channel = subscribeToOrders(canteenId, () => loadOrders());
    return () => channel?.unsubscribe();
  }, [loadOrders, canteenId]);

  const markAsCompleted = async (orderId) => {
    setActionLoading(true);
    try {
      await updateOrderStatus(orderId, "completed");
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setSelectedOrder(null);
    } catch (e) {
      alert("Failed: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const formatOrderId = (id) => "ORD-" + id.substring(0, 8).toUpperCase();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F7F8FA",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ping {
          0%   { transform: scale(1);   opacity: 1; }
          70%  { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        .order-card {
          transition: box-shadow 0.18s, transform 0.18s, border-color 0.18s;
        }
        .order-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.10) !important;
          transform: translateY(-3px) !important;
          border-color: #A7F3D0 !important;
        }
        .back-btn:hover { background: rgba(255,255,255,0.18) !important; }
        .collect-btn:hover { background: linear-gradient(135deg,#16a34a,#15803d) !important; }
      `}</style>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Orbs */}
        <div style={{
          position: "absolute", top: -50, right: -40,
          width: 220, height: 220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,222,128,0.16) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -35, left: "38%",
          width: 150, height: 150, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(134,239,172,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: -30,
          transform: "translateY(-50%)",
          width: 110, height: 110, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem 2rem", position: "relative" }}>
          {/* Back nav */}
          <div style={{ marginBottom: "1rem" }}>
            <button
              className="back-btn"
              onClick={() => window.history.back()}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 8,
                color: "rgba(255,255,255,0.85)",
                fontSize: 13, fontWeight: 500,
                padding: "6px 14px",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                backdropFilter: "blur(6px)",
                transition: "background 0.15s",
                fontFamily: "inherit",
              }}
            >
              ← Back
            </button>
          </div>

          {/* Title row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingBottom: "1.5rem",
            animation: "fadeSlideUp 0.35s ease both",
          }}>
            {/* Left */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 56, height: 56,
                background: "linear-gradient(135deg, rgba(74,222,128,0.25), rgba(134,239,172,0.15))",
                border: "1px solid rgba(74,222,128,0.4)",
                borderRadius: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28,
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 20px rgba(74,222,128,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                flexShrink: 0,
              }}>
                ✅
              </div>
              <div>
                <h1 style={{
                  fontSize: 22, fontWeight: 800,
                  color: "#ffffff", margin: 0,
                  letterSpacing: "-0.6px",
                  fontFamily: "'Sora', 'Inter', system-ui, sans-serif",
                  textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}>
                  Ready Orders
                </h1>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "4px 0 0" }}>
                  Orders ready for customer pickup
                </p>
              </div>
            </div>

            {/* Right: badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(74,222,128,0.12)",
              border: "1px solid rgba(74,222,128,0.3)",
              borderRadius: 99,
              padding: "7px 16px",
              backdropFilter: "blur(6px)",
              position: "relative",
            }}>
              {/* Ping animation */}
              <span style={{
                position: "relative",
                display: "inline-flex",
                width: 10, height: 10,
              }}>
                <span style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50%",
                  background: "#4ade80",
                  animation: "ping 1.4s ease-out infinite",
                }} />
                <span style={{
                  position: "relative",
                  width: 10, height: 10, borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 8px rgba(74,222,128,0.9)",
                  display: "inline-block",
                }} />
              </span>
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: "#4ade80",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
                Awaiting Pickup
              </span>
              {orders.length > 0 && (
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: "rgba(74,222,128,0.7)",
                  marginLeft: 2,
                }}>
                  · {orders.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom glow line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.5), transparent)",
        }} />
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 2rem" }}>

        {/* No canteen */}
        {!canteenId && (
          <div style={{
            background: "#FFFBEB", border: "1px solid #FDE68A",
            borderRadius: 10, padding: "14px 18px",
            fontSize: 14, color: "#92400E",
            marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span>⚠️</span> No canteen assigned to your account.
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA",
            borderRadius: 10, padding: "14px 18px",
            fontSize: 14, color: "#DC2626",
            marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span>⚠️</span> Error: {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
            <div style={{
              width: 36, height: 36,
              border: "3px solid #E5E7EB",
              borderTop: "3px solid #16a34a",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }} />
          </div>

        ) : orders.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: 200,
            background: "#ffffff", border: "1px solid #E5E7EB",
            borderRadius: 14,
            animation: "fadeSlideUp 0.35s ease both",
          }}>
            <span style={{ fontSize: 40, marginBottom: 12 }}>✅</span>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#6B7280", margin: 0 }}>
              No orders ready for pickup
            </p>
          </div>

        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
          }}>
            {orders.map((order, idx) => (
              <div
                key={order.id}
                className="order-card"
                onClick={() => setSelectedOrder(order)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #D1FAE5",
                  borderRadius: 14,
                  padding: "1.25rem 1.5rem",
                  cursor: "pointer",
                  display: "flex", flexDirection: "column", gap: 6,
                  userSelect: "none",
                  animation: `fadeSlideUp 0.4s ease ${idx * 0.05}s both`,
                }}
              >
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>
                    {order.profiles?.full_name || "Customer"}
                  </p>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    background: "#F0FDF4",
                    color: "#15803D",
                    border: "1px solid #BBF7D0",
                    borderRadius: 99,
                    padding: "3px 10px",
                  }}>
                    Ready 🟢
                  </span>
                </div>

                {/* Order ID */}
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0, fontWeight: 500 }}>
                  {formatOrderId(order.id)}
                </p>

                {/* Time + items */}
                <p style={{ fontSize: 12, color: "#D1D5DB", margin: 0 }}>
                  {formatTime(order.created_at)} · {order.order_items?.length || 0} item(s)
                </p>

                <div style={{ borderTop: "1px solid #F3F4F6", margin: "6px 0" }} />

                {/* Amount */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.3px" }}>
                    ₹{Number(order.total_amount).toFixed(2)}
                  </p>
                  <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 500 }}>
                    View details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ───────────────────────────────────────────────────── */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.38)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 50, padding: "1rem",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: "1.75rem",
              width: "100%", maxWidth: 440,
              position: "relative",
              animation: "fadeSlideUp 0.25s ease both",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: "absolute", top: 14, right: 14,
                background: "#F3F4F6", border: "none",
                borderRadius: 8, width: 30, height: 30,
                fontSize: 14, color: "#6B7280",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</button>

            {/* Heading */}
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
              Ready for Pickup
            </h2>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 1.25rem" }}>
              {selectedOrder.profiles?.full_name || "Customer"} — {formatOrderId(selectedOrder.id)}
            </p>

            {/* Items */}
            <div style={{
              borderTop: "1px solid #F3F4F6",
              borderBottom: "1px solid #F3F4F6",
              padding: "12px 0",
              maxHeight: 200, overflowY: "auto",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {selectedOrder.order_items?.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, color: "#374151" }}>
                    {item.menu_items?.name || "Item"} × {item.quantity}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>
                    ₹{(item.price_at_time * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: "1rem",
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Total</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                ₹{Number(selectedOrder.total_amount).toFixed(2)}
              </span>
            </div>

            {/* Action */}
            <button
              className="collect-btn"
              onClick={() => markAsCompleted(selectedOrder.id)}
              disabled={actionLoading}
              style={{
                marginTop: "1.25rem",
                width: "100%",
                padding: "11px",
                borderRadius: 10,
                border: "none",
                background: actionLoading
                  ? "#BBF7D0"
                  : "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "#ffffff",
                fontSize: 14, fontWeight: 700,
                cursor: actionLoading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                boxShadow: actionLoading ? "none" : "0 2px 12px rgba(34,197,94,0.35)",
                transition: "all 0.15s",
              }}
            >
              {actionLoading ? "Updating…" : "Mark as Collected ✓"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadyOrdersPage;