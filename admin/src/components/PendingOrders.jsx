import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "./config/url";

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch detailed pending orders
    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/admin/orders/pending`);
        setPendingOrders(response.data);
      } catch (error) {
        console.error("Error fetching pending orders:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600 animate-pulse">
          Loading Pending Orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50 py-10 px-4 lg:px-16">
      <div className="relative flex flex-col">
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
            Pending Orders
          </h1>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            {pendingOrders.length > 0 ? (
              <table className="table-auto w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                    <th className="px-6 py-4 text-left font-bold">Order ID</th>
                    <th className="px-6 py-4 text-left font-bold">User</th>
                    <th className="px-6 py-4 text-left font-bold">Seller</th>
                    <th className="px-6 py-4 text-left font-bold">Date</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                 
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } hover:bg-gray-200 transition-colors duration-300`}
                    >
                      <td className="px-6 py-4 text-gray-800 font-semibold">
                        {order.orderId}
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
                      <td className="px-6 py-4 text-yellow-600 font-medium">
                        {order.latestStatus.status || "Pending"}
                      </td>
                      <td className="px-6 py-4 text-center">
                     
                       
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-6 py-4 text-center text-gray-600 font-medium">
                No pending orders found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;
