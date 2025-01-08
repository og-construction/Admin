import React, { useEffect, useState } from "react";
import axios from "axios";

const CancelledOrders = () => {
  const [CancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch detailed pending orders
    const fetchCancelledOrders= async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/orders/cancelled"
        );
        setCancelledOrders(response.data);
      } catch (error) {
        console.error("Error fetching pending orders:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Cancelled Orders</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Cancelled Orders</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {CancelledOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="text-left py-3 px-4 border-b">Order ID</th>
                  <th className="text-left py-3 px-4 border-b">User</th>
                  <th className="text-left py-3 px-4 border-b">Seller</th>
                  <th className="text-left py-3 px-4 border-b">Date</th>
                  <th className="text-left py-3 px-4 border-b">Status</th>
                  <th className="text-left py-3 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {CancelledOrders.map((order, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="py-3 px-4 border-b">{order.orderId}</td>
                    <td className="py-3 px-4 border-b">
                      {order.userName || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {order.sellerName || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {new Date(order.latestStatus.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 border-b text-yellow-600 font-medium">
                      {order.latestStatus.status || "Pending"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600">
                        Approve
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No pending orders available.</p>
        )}
      </div>
    </div>
  );
};

export default CancelledOrders;
