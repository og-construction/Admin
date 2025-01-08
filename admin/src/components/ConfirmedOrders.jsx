import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "./config/url";

const ConfirmedOrders = () => {
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${baseurl}/api/admin/orders/confirmed`
        );
        setConfirmedOrders(response.data);
      } catch (error) {
        console.error("Error fetching confirmed orders:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Confirmed Orders</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Confirmed Orders</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {confirmedOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="text-left py-3 px-4 border-b">Order ID</th>
                  <th className="text-left py-3 px-4 border-b">User</th>
                  <th className="text-left py-3 px-4 border-b">Seller</th>
                  <th className="text-left py-3 px-4 border-b">Status</th>
                  <th className="text-left py-3 px-4 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {confirmedOrders.map((order, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="py-3 px-4 border-b">{order.orderId || "N/A"}</td>
                    <td className="py-3 px-4 border-b">{order.userName}</td>
                    <td className="py-3 px-4 border-b">{order.sellerName}</td>
                    <td className="py-3 px-4 border-b">{order.latestStatus.status}</td>
                    <td className="py-3 px-4 border-b">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No confirmed orders available.</p>
        )}
      </div>
    </div>
  );
};

export default ConfirmedOrders;
