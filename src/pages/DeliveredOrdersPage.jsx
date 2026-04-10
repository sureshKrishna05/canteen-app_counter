import React, { useState, useEffect, useCallback } from "react";
import HeaderBar from "../components/HeaderBar";
import { useAuth } from "../context/AuthContext";
import { getOrdersByStatus } from "../database/supabaseService";

const DeliveredOrdersPage = () => {
  const { profile } = useAuth();
  const canteenId = profile?.canteen_id; // ✅ Moved UP

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(!!canteenId); // ✅ Starts false if no ID
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(""); // ✅ Added error state

  const loadOrders = useCallback(async () => {
    // ✅ Don't exit early without stopping the spinner!
    if (!canteenId) {
      setLoading(false);
      return;
    }

    setLoading(true); // ✅ Start spinner when fetching
    try {
      const data = await getOrdersByStatus(canteenId, ["completed"]);
      setOrders(data);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false); // ✅ Always guaranteed to stop
    }
  }, [canteenId]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const formatDate = (ts) =>
    new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  const formatOrderId = (id) => "ORD-" + id.substring(0, 8).toUpperCase();

  // ✅ Today's revenue summary
  const todayRevenue = orders
    .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <div className="p-6 min-h-screen">
      <HeaderBar title="Delivered Orders" icon="🚚" actionType="Back" />

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

      {/* Summary bar */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/70 rounded-xl p-4 text-center shadow">
            <p className="text-sm text-gray-500">Today's Orders</p>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
          <div className="bg-white/70 rounded-xl p-4 text-center shadow">
            <p className="text-sm text-gray-500">Today's Revenue</p>
            <p className="text-2xl font-bold text-orange-600">₹{todayRevenue.toFixed(0)}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-medium">No completed orders yet</p>
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
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                  Completed ✓
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{formatOrderId(order.id)}</p>
              <p className="text-sm text-gray-400">{formatDate(order.created_at)} at {formatTime(order.created_at)}</p>
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

            <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Details</h2>
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

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveredOrdersPage;