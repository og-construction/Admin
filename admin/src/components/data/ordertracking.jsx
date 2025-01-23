import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const OrderTrackingPage = () => {
  const [orderTrackings, setOrderTrackings] = useState([]);
  const [filteredTrackings, setFilteredTrackings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrderTrackings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/orderTracking`);
        const data = response.data;

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: Expected an array.");
        }
        setOrderTrackings(data);
        setFilteredTrackings(data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching order tracking data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderTrackings();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...orderTrackings];

      if (statusFilter !== "All") {
        filtered = filtered.filter((tracking) =>
          tracking.statusUpdates.some((update) => update.status === statusFilter)
        );
      }

      if (search) {
        filtered = filtered.filter(
          (tracking) =>
            tracking.user?.userName?.toLowerCase().includes(search.toLowerCase()) ||
            tracking.user?.userEmail?.toLowerCase().includes(search.toLowerCase())
        );
      }

      setFilteredTrackings(filtered);
    };

    applyFilters();
  }, [statusFilter, search, orderTrackings]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Order Tracking</h1>
      <div className="flex flex-wrap items-center mb-4 gap-4 bg-gray-100 p-4 rounded-md shadow-md">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <input
          type="text"
          placeholder="Search by user name or email..."
          value={search}
          onChange={handleSearch}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <span className="text-gray-700 font-medium">Total Trackings: {filteredTrackings.length}</span>
      </div>

      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && (
        <div className="text-red-500 text-center">
          Error: {error}
          <button
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !error && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Seller Name</th>
                <th className="px-4 py-2 border">User Name</th>
                <th className="px-4 py-2 border">User Email</th>
                <th className="px-4 py-2 border">Latest Status</th>
                <th className="px-4 py-2 border">Products</th>
                <th className="px-4 py-2 border">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrackings.map((tracking) => (
                <tr key={tracking.id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border">{tracking.order?.orderId || "N/A"}</td>
                  <td className="px-4 py-2 border">{tracking.seller?.sellerName || "N/A"}</td>
                  <td className="px-4 py-2 border">{tracking.user?.userName || "N/A"}</td>
                  <td className="px-4 py-2 border">{tracking.user?.userEmail || "N/A"}</td>
                  <td className="px-4 py-2 border">
                    {tracking.statusUpdates[tracking.statusUpdates.length - 1]?.status || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {tracking.statusUpdates.map((update, index) => (
                      <div key={index} className="text-left">
                        {update.product.productName} - ₹{update.product.productPrice}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(tracking.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
