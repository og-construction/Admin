import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "./config/url";

const CancelledOrders = () => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cancelled orders
    const fetchCancelledOrders = async () => {
      try {
        const response = await axios.get(
          `${baseurl}/api/admin/orders/cancelled`
        );
        setCancelledOrders(response.data);
      } catch (error) {
        console.error("Error fetching cancelled orders:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-600 animate-pulse">
          Loading Cancelled Orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-red-50 py-10 px-4 lg:px-16">
      <div className="relative flex flex-col">
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
            Cancelled Orders
          </h1>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            {cancelledOrders.length > 0 ? (
              <table className="table-auto w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-red-400 to-red-500 text-white">
                    <th className="px-6 py-4 text-left font-bold">Order ID</th>
                    <th className="px-6 py-4 text-left font-bold">User</th>
                    <th className="px-6 py-4 text-left font-bold">Seller</th>
                    <th className="px-6 py-4 text-left font-bold">Date</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cancelledOrders.map((order, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } hover:bg-gray-200 transition-colors duration-300`}
                    >
                      <td className="px-6 py-4 text-gray-800 font-semibold">
                        {order.orderId || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {order.userName || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {order.sellerName || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(order.latestStatus.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-red-600 font-medium">
                        {order.latestStatus.status || "Cancelled"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-6 py-4 text-center text-gray-600 font-medium">
                No cancelled orders found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelledOrders;
