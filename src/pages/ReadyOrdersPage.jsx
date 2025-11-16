import React, { useState } from "react";
import HeaderBar from "../components/HeaderBar";

const ReadyOrdersPage = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD140",
      customerName: "Customer B",
      total: 180,
      status: "ready",
      time: "11:30 AM",
      items: [{ name: "Meals", qty: 1, price: 180 }],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const markAsDelivered = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "delivered" } : o
      )
    );
    setSelectedOrder(null);
  };

  return (
    <div className="p-6 min-h-screen">
      <HeaderBar title="Ready Orders" icon="✅" actionType="Back" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="
              cursor-pointer bg-white bg-opacity-70 rounded-xl
              shadow-md hover:shadow-lg p-5 transition transform 
              hover:-translate-y-1 border border-gray-200
            "
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{order.customerName}</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                ready
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2">Order ID: {order.id}</p>
            <p className="text-sm text-gray-600">{order.time}</p>
            <p className="mt-3 text-gray-900 font-bold text-lg">₹{order.total}</p>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">

            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Ready</h2>

            <div className="border-t border-b py-3 max-h-48 overflow-y-auto">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1">
                  <span>{item.name} × {item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 font-bold text-lg">
              <span>Total:</span>
              <span>₹{selectedOrder.total}</span>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => markAsDelivered(selectedOrder.id)}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Mark as Delivered
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ReadyOrdersPage;
