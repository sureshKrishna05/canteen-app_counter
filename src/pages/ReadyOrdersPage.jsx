import React, { useState, useEffect, useCallback } from "react";
import HeaderBar from "../components/HeaderBar";
import { useAuth } from "../context/AuthContext";
import { getOrdersByStatus, updateOrderStatus, subscribeToOrders } from "../database/supabaseService";

const ReadyOrdersPage = () => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const canteenId = profile?.canteen_id;

  const loadOrders = useCallback(async () => {
    if (!canteenId) return;
    try {
      const data = await getOrdersByStatus(canteenId, ["ready"]);
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [canteenId]);

  useEffect(() => {
    loadOrders();
    const channel = subscribeToOrders(canteenId, () => loadOrders());
    return () => channel?.unsubscribe();
  }, [loadOrders, canteenId]);

  // ✅ Mark as Completed (delivered/picked up)
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
    <div className="p-6 min-h-screen">
      <HeaderBar title="Ready Orders" icon="✅" actionType="Back" />

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <div className="text-5xl mb-3">✅</div>
          <p className="font-medium">No orders ready for pickup</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="cursor-pointer bg-white bg-opacity-80 rounded-xl shadow-md hover:shadow-lg p-5 transition transform hover:-translate-y-1 border border-green-200"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {order.profiles?.full_name || "Customer"}
                </h2>
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                  Ready 🟢
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

            <h2 className="text-xl font-semibold text-gray-800 mb-1">Ready for Pickup</h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedOrder.profiles?.full_name || "Customer"} — {formatOrderId(selectedOrder.id)}
            </p>

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

            <div className="flex justify-end mt-6">
              <button
                onClick={() => markAsCompleted(selectedOrder.id)}
                disabled={actionLoading}
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 font-semibold"
              >
                {actionLoading ? "..." : "Mark as Collected ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadyOrdersPage;