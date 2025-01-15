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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Tracking</h1>
      <div className="flex flex-wrap items-center mb-4 gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded"
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
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <span>Total Trackings: {filteredTrackings.length}</span>
      </div>

      {loading && <div>Loading...</div>}
      {error && (
        <div className="text-red-500">
          Error: {error}
          <button
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
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
                <tr key={tracking.id}>
                  <td className="px-4 py-2 border">{tracking.order?.orderId || "N/A"}</td>
                  <td className="px-4 py-2 border">{tracking.seller?.sellerName || "N/A"}</td>
                  <td className="px-4 py-2 border">{tracking.user?.userName || "N/A"}</td>
                  <td className="px-4 py-2 border">{tracking.user?.userEmail || "N/A"}</td>
                  <td className="px-4 py-2 border">
                    {tracking.statusUpdates[tracking.statusUpdates.length - 1]?.status || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {tracking.statusUpdates.map((update, index) => (
                      <div key={index}>
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
