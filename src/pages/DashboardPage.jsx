import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // your Firebase config file
import { collection, query, where, onSnapshot } from 'firebase/firestore';

// --- Icons ---
const IconPending = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconProcessing = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const IconDelivered = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

// --- Reusable Stat Card ---
const StatCard = ({ title, value, colorClass, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left bg-white p-6 rounded-lg shadow-md flex items-center ${colorClass} transition-transform transform hover:scale-105`}
  >
    <div className="p-4 rounded-full bg-white bg-opacity-30">{icon}</div>
    <div className="ml-4">
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </button>
);

const DashboardPage = ({ setActivePage, setSelectedStatus }) => {
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    delivered: 0,
  });

  // Real-time listener for order counts
  useEffect(() => {
    const statuses = ["pending", "processing", "delivered"];
    const unsubscribers = [];

    statuses.forEach((status) => {
      const q = query(collection(db, "canteen_orders"), where("status", "==", status));
      const unsub = onSnapshot(q, (snapshot) => {
        setStats((prev) => ({ ...prev, [status]: snapshot.size }));
      });
      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach((u) => u());
  }, []);

  return (
    <div className="p-4 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Pending Orders"
          value={stats.pending}
          colorClass="bg-yellow-100 border-l-4 border-yellow-500"
          icon={<IconPending />}
          onClick={() => {
            setSelectedStatus("pending");
            setActivePage("OrderList");
          }}
        />
        <StatCard
          title="Processing Orders"
          value={stats.processing}
          colorClass="bg-blue-100 border-l-4 border-blue-500"
          icon={<IconProcessing />}
          onClick={() => {
            setSelectedStatus("processing");
            setActivePage("OrderList");
          }}
        />
        <StatCard
          title="Delivered Orders"
          value={stats.delivered}
          colorClass="bg-green-100 border-l-4 border-green-500"
          icon={<IconDelivered />}
          onClick={() => {
            setSelectedStatus("delivered");
            setActivePage("OrderList");
          }}
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Example: show 5 most recent orders */}
              {["pending", "processing", "delivered"].map((status) => (
                <tr key={status}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">AutoFetch Later</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Student ID</td>
                  <td className="px-6 py-4 text-sm text-gray-500">₹ --</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
