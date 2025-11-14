import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar";

const OrdersPage = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD123",
      customerName: "Customer 1",
      total: 230,
      status: "pending",
      time: "10:32 AM",
      items: [
        { name: "Veg puffs", qty: 2, price: 50 },
        { name: "Coffee", qty: 1, price: 15 },
        { name: "Juice", qty: 1, price: 80},
      ],
    },
    {
      id: "ORD124",
      customerName: "Customer 2",
      total: 120,
      status: "pending",
      time: "10:45 AM",
      items: [{ name: "Dosa", qty: 2, price: 80 }],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Confirm → move to "processing"
  const handleConfirmOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "processing" } : o
      )
    );
    setSelectedOrder(null);
  };

  // Reject → delete
  const handleRejectOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    setSelectedOrder(null);
  };

  return (
    <div className="p-6 min-h-screen">
      {/* 🔥 Uniform glass header */}
      <HeaderBar title="Orders" icon="📦" actionType="Back" />

      {/* Orders grid */}
      <h2 className="text-xl font-semibold text-white mb-4">
        Pending Orders
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="
              cursor-pointer 
              bg-white bg-opacity-70 
              rounded-xl 
              shadow-md 
              hover:shadow-lg 
              p-5 
              transition 
              transform 
              hover:-translate-y-1 
              border border-gray-200
            "
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {order.customerName}
              </h2>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Order ID: {order.id}
            </p>
            <p className="text-sm text-gray-600">Time: {order.time}</p>

            <p className="mt-3 text-gray-900 font-bold text-lg">
              ₹{order.total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="
          fixed inset-0 
          flex items-center justify-center 
          bg-black bg-opacity-40 
          backdrop-blur-sm 
          z-50
        ">
          <div className="
            bg-white 
            rounded-2xl 
            p-6 
            w-full max-w-md 
            shadow-xl 
            relative
          ">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Order Details
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedOrder.customerName} — {selectedOrder.id}
            </p>

            <div className="border-t border-b py-3 max-h-48 overflow-y-auto">
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-gray-700 text-sm py-1"
                >
                  <span>{item.name} × {item.qty}</span>
                  <span>
                    ₹{(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 text-lg font-bold">
              <span>Total:</span>
              <span>₹{selectedOrder.total.toFixed(2)}</span>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => handleRejectOrder(selectedOrder.id)}
                className="
                  px-4 py-2 rounded-lg 
                  bg-red-100 text-red-600 
                  hover:bg-red-200 
                  transition
                "
              >
                Reject
              </button>

              <button
                onClick={() => handleConfirmOrder(selectedOrder.id)}
                className="
                  px-4 py-2 rounded-lg 
                  bg-green-500 text-white 
                  hover:bg-green-600 
                  transition
                "
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
