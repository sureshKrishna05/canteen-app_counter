import React, { useState, useEffect, useCallback } from "react";
import HeaderBar from "../components/HeaderBar";
import { useAuth } from "../context/AuthContext";
import { getOrdersByStatus, updateOrderStatus, subscribeToOrders } from "../database/supabaseService";

const ProcessingOrdersPage = () => {
  const { profile } = useAuth();
  const canteenId = profile?.canteen_id; // ✅ Moved UP to use in useState

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(!!canteenId); // ✅ Starts false if no ID
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    // ✅ Don't exit early without stopping the spinner!
    if (!canteenId) {
      setLoading(false);
      return;
    }

    setLoading(true); // ✅ Start spinner when fetching
    try {
      // accepted = just accepted, preparing = actively cooking
      const data = await getOrdersByStatus(canteenId, ["accepted", "preparing"]);
      setOrders(data);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false); // ✅ Always guaranteed to stop
    }
  }, [canteenId]);

  useEffect(() => {
    loadOrders();
    const channel = subscribeToOrders(canteenId, () => loadOrders());
    return () => channel?.unsubscribe();
  }, [loadOrders, canteenId]);

  // ✅ Mark as Ready
  const markAsReady = async (orderId) => {
    setActionLoading(true);
    try {
      await updateOrderStatus(orderId, "ready");
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setSelectedOrder(null);
    } catch (e) {
      alert("Failed: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Start Preparing (accepted → preparing)
  const startPreparing = async (orderId) => {
    setActionLoading(true);
    try {
      await updateOrderStatus(orderId, "preparing");
      await loadOrders(); // Refresh to get the new status
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

  const STATUS_COLOR = {
    accepted:  "bg-blue-100 text-blue-700",
    preparing: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="p-6 min-h-screen">
      <HeaderBar title="Processing Orders" icon="🍳" actionType="Back" />

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
          <div className="text-5xl mb-3">🍳</div>
          <p className="font-medium">No orders being prepared</p>
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
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{formatOrderId(order.id)}</p>
              <p className="text-sm text-gray-500">{formatTime(order.created_at)}</p>
              <p className="text-sm text-gray-500 mt-1">{order.order_items?.length || 0} item(s)</p>
              <p className="mt-3 text-gray-900 font-bold text-lg">
                ₹{Number(order.total_amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <button onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl">✕</button>

            <h2 className="text-xl font-semibold text-gray-800 mb-1">Order Details</h2>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-sm text-gray-500">{formatOrderId(selectedOrder.id)}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[selectedOrder.status]}`}>
                {selectedOrder.status}
              </span>
            </div>

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
              {selectedOrder.status === "accepted" && (
                <button
                  onClick={() => startPreparing(selectedOrder.id)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {actionLoading ? "..." : "Start Preparing"}
                </button>
              )}
              <button
                onClick={() => markAsReady(selectedOrder.id)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-50"
              >
                {actionLoading ? "..." : "Mark as Ready ✅"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingOrdersPage;