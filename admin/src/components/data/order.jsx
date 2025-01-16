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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Orders Management</h1>
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
        <span className="text-gray-700 font-medium">Total Orders: {filteredOrders.length}</span>
      </div>

      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && (
        <div className="text-red-500 text-center">
          Error: {error}
          <button
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="table-auto w-full border border-gray-300">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
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
                  <tr key={order._id} className="text-center hover:bg-gray-100">
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
          <div className="mt-4 flex justify-center items-center gap-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">{`Page ${currentPage} of ${Math.ceil(filteredOrders.length / pageSize)}`}</span>
            <button
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
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
