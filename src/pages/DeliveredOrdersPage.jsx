import React, { useState } from "react";
import HeaderBar from "../components/HeaderBar";

const DeliveredOrdersPage = () => {
  const [orders] = useState([
    {
      id: "ORD150",
      customerName: "Customer C",
      total: 200,
      status: "delivered",
      time: "11:50 AM",
      items: [{ name: "Parotta", qty: 2, price: 100 }],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="p-6 min-h-screen">
      <HeaderBar title="Delivered Orders" icon="🚚" actionType="Back" />

      {/* Cards grid */}
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

              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                Delivered
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Order ID: {order.id}
            </p>
            <p className="text-sm text-gray-600">{order.time}</p>

            <p className="mt-3 text-gray-900 font-bold text-lg">
              ₹{order.total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div
          className="
            fixed inset-0 
            flex items-center justify-center 
            bg-black bg-opacity-40 
            backdrop-blur-sm 
            z-50
          "
        >
          <div
            className="
              bg-white 
              rounded-2xl 
              p-6 
              w-full max-w-md 
              shadow-xl 
              relative
            "
          >
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
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 text-lg font-bold">
              <span>Total:</span>
              <span>₹{selectedOrder.total.toFixed(2)}</span>
            </div>

            {/* Close Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="
                  px-6 py-2 
                  rounded-lg 
                  bg-gray-300 text-gray-800 
                  hover:bg-gray-400 
                  transition
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveredOrdersPage;
