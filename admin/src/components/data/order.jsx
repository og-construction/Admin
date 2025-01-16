import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/orders`);
        const data = response.data.orders;
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: Expected an array.");
        }
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...orders];

      // Filter by status
      if (statusFilter !== "All") {
        filtered = filtered.filter((order) => order.status === statusFilter);
      }

      // Filter by search query (name or email)
      if (search) {
        filtered = filtered.filter(
          (order) =>
            order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(search.toLowerCase())
        );
      }

      setFilteredOrders(filtered);
    };

    applyFilters();
  }, [statusFilter, search, orders]);

  // Pagination logic
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
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
        <span>Total Orders: {filteredOrders.length}</span>
      </div>

      {loading && <div>Loading...</div>}
      {error && (
        <div className="text-red-500">
          Error: {error}
          <button
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Order ID</th>
                  <th className="px-4 py-2 border">User</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Total Amount</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Created At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-2 border">{order._id}</td>
                    <td className="px-4 py-2 border">{order.user?.name || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.user?.email || "N/A"}</td>
                    <td className="px-4 py-2 border">₹{order.totalAmount}</td>
                    <td className="px-4 py-2 border">{order.status}</td>
                    <td className="px-4 py-2 border">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              className="px-4 py-2 border"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2">{`Page ${currentPage}`}</span>
            <button
              className="px-4 py-2 border"
              onClick={() =>
                setCurrentPage((prev) => {
                  const maxPages = Math.ceil(filteredOrders.length / pageSize);
                  return Math.min(prev + 1, maxPages);
                })
              }
              disabled={currentPage * pageSize >= filteredOrders.length}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
