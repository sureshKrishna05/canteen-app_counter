import React, { useState, useEffect, useCallback } from "react";
import HeaderBar from "../components/HeaderBar";
import { useAuth } from "../context/AuthContext";
import { getOrdersByStatus, updateOrderStatus, subscribeToOrders } from "../database/supabaseService";

const STATUS_BADGE = {
  paid:      "bg-yellow-100 text-yellow-700",
  created:   "bg-gray-100 text-gray-600",
  accepted:  "bg-blue-100 text-blue-700",
};

const OrdersPage = () => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const canteenId = profile?.canteen_id;

  const loadOrders = useCallback(async () => {
    if (!canteenId) return;
    try {
      // Show new orders: paid (awaiting acceptance) and created
      const data = await getOrdersByStatus(canteenId, ["paid", "created"]);
      setOrders(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [canteenId]);

  useEffect(() => {
    loadOrders();

    // ✅ Real-time subscription — refresh when any order changes
    const channel = subscribeToOrders(canteenId, () => loadOrders());
    return () => channel?.unsubscribe();
  }, [loadOrders, canteenId]);

  // ✅ Accept → moves to "accepted" → canteen starts preparing
  const handleAccept = async (orderId) => {
    setActionLoading(true);
    try {
      await updateOrderStatus(orderId, "accepted");
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setSelectedOrder(null);
    } catch (e) {
      alert("Failed: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Reject → moves to "cancelled"
  const handleReject = async (orderId) => {
    if (!window.confirm("Reject this order? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      await updateOrderStatus(orderId, "cancelled");
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
    <div className="p-6 min-h-screen">
      <HeaderBar title="New Orders" icon="📦" actionType="Back" />

      {!canteenId && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-4">
          ⚠️ No canteen assigned to your account.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <div className="text-5xl mb-3">📭</div>
          <p className="font-medium">No new orders right now</p>
          <p className="text-sm mt-1">New orders will appear here in real-time</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="cursor-pointer bg-white bg-opacity-80 rounded-xl shadow-md hover:shadow-lg p-5 transition transform hover:-translate-y-1 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {order.profiles?.full_name || "Customer"}
                </h2>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_BADGE[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{formatOrderId(order.id)}</p>
              <p className="text-sm text-gray-500">{formatTime(order.created_at)}</p>
              <p className="text-sm text-gray-500 mt-1">
                {order.order_items?.length || 0} item(s)
              </p>
              <p className="mt-3 text-gray-900 font-bold text-lg">
                ₹{Number(order.total_amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <button onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl">✕</button>

            <h2 className="text-xl font-semibold text-gray-800 mb-1">Order Details</h2>
            <p className="text-sm text-gray-500 mb-1">
              {selectedOrder.profiles?.full_name || "Customer"} — {formatOrderId(selectedOrder.id)}
            </p>
            <p className="text-xs text-gray-400 mb-4">{formatTime(selectedOrder.created_at)}</p>

            <div className="border-t border-b py-3 max-h-48 overflow-y-auto space-y-2">
              {selectedOrder.order_items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-gray-700 text-sm">
                  <span>{item.menu_items?.name || "Item"} × {item.quantity}</span>
                  <span>₹{(item.price_at_time * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 text-lg font-bold">
              <span>Total</span>
              <span>₹{Number(selectedOrder.total_amount).toFixed(2)}</span>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => handleReject(selectedOrder.id)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleAccept(selectedOrder.id)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition disabled:opacity-50"
              >
                {actionLoading ? "..." : "Accept Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;