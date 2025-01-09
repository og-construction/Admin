import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "./config/url";

const ShippedOrders = () => {
  const [shippedOrders, setShippedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch detailed Shipped orders
    const fetchShippedOrders = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/admin/orders/shipped`);
        setShippedOrders(response.data);
      } catch (error) {
        console.error("Error fetching shipped orders:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShippedOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600 animate-pulse">
          Loading Shipped Orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50 py-10 px-4 lg:px-16">
      <div className="relative flex flex-col">
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
            Shipped Orders
          </h1>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            {shippedOrders.length > 0 ? (
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
                  {shippedOrders.map((order, index) => (
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
                        {order.latestStatus.status || "Shipped"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-6 py-4 text-center text-gray-600 font-medium">
                No shipped orders available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippedOrders;
