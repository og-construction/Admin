import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderSummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/order-summary"
        );
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching order summary:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-extrabold text-gray-700 animate-pulse">
          Loading Order Summary...
        </h1>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-extrabold text-red-500">
          Failed to fetch order summary.
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 min-h-screen">
      <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center">
        Order Summary
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">
            Pending Orders
          </h2>
          <p className="text-gray-700 text-4xl font-bold">
            {summary.totalPendingOrder}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-green-600 mb-2">
            Confirmed Orders
          </h2>
          <p className="text-gray-700 text-4xl font-bold">
            {summary.totalConfirmedOrder}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Cancelled Orders
          </h2>
          <p className="text-gray-700 text-4xl font-bold">
            {summary.totalCanceledOrder}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">
            Delivered Orders
          </h2>
          <p className="text-gray-700 text-4xl font-bold">
            {summary.totalDeliveredOrder}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-yellow-600 mb-2">
            Shipped Orders
          </h2>
          <p className="text-gray-700 text-4xl font-bold">
            {summary.totalShippedOrder}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
