import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const OtherPaymentDataPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);
  const pageSize = 10;

  useEffect(() => {
    const fetchOtherPayments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/otherPayment`);
        const data = response.data || [];
        setPayments(data);
        setFilteredPayments(data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOtherPayments();
  }, []);

  // Filter payments based on search
  useEffect(() => {
    const filteredData = payments.filter(
      (payment) =>
        payment.id.toString().includes(search) ||
        payment.sellerDetails?.sellerName?.toLowerCase().includes(search.toLowerCase()) ||
        payment.userDetails?.userName?.toLowerCase().includes(search.toLowerCase()) ||
        payment.productDetails.some((product) =>
          product.productName?.toLowerCase().includes(search.toLowerCase())
        )
    );
    setFilteredPayments(filteredData);
  }, [search, payments]);

  // Paginate filtered payments
  const paginatedData = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Other Payments</h1>

      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search by ID, User Name, Seller Name, or Product Name..."
          value={search}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading && <div>Loading...</div>}
      {error && (
        <div className="text-red-500">
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
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Method</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Bank Name</th>
                  <th className="px-4 py-2 border">Transaction ID</th>
                  <th className="px-4 py-2 border">User</th>
                  <th className="px-4 py-2 border">Seller</th>
                  <th className="px-4 py-2 border">Products</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((payment) => (
                  <tr key={payment.id} className="text-center hover:bg-gray-100">
                    <td className="px-4 py-2 border">{payment.id}</td>
                    <td className="px-4 py-2 border">{payment.method}</td>
                    <td className="px-4 py-2 border">₹{payment.amount}</td>
                    <td className="px-4 py-2 border">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{payment.bankName}</td>
                    <td className="px-4 py-2 border">{payment.transactionId}</td>
                    <td className="px-4 py-2 border">
                      {payment.userDetails?.userName} ({payment.userDetails?.userEmail})
                    </td>
                    <td className="px-4 py-2 border">
                      {payment.sellerDetails?.sellerName} ({payment.sellerDetails?.sellerEmail})
                    </td>
                    <td className="px-4 py-2 border">
                      {payment.productDetails.map((product) => (
                        <div key={product.productId}>
                          {product.productName} - ₹{product.productPrice}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center items-center space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2">{`Page ${currentPage} of ${Math.ceil(filteredPayments.length / pageSize)}`}</span>
            <button
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage * pageSize >= filteredPayments.length}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OtherPaymentDataPage;
