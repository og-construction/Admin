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
        console.log(response.data); // Log the response to verify the structure
        const data = response.data || [];
        setPayments(data);
        setFilteredPayments(data); // Set filtered data initially as all data
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
    const filteredData = payments.filter((payment) =>
      payment.sellerDetails?.sellerName?.toLowerCase().includes(search.toLowerCase()) ||
      payment.userDetails?.userName?.toLowerCase().includes(search.toLowerCase())
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
    setCurrentPage(1); // Reset to the first page on search
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Other Payments</h1>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search by user or seller name..."
          value={search}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded mr-2"
        />
        <span>Total Payments: {filteredPayments.length}</span>
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
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{payment.method}</td>
                    <td>₹{payment.amount}</td>
                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                    <td>{payment.bankName}</td>
                    <td>{payment.transactionId}</td>
                    <td>
                      {payment.userDetails?.userName} ({payment.userDetails?.userEmail})
                    </td>
                    <td>
                      {payment.sellerDetails?.sellerName} ({payment.sellerDetails?.sellerEmail})
                    </td>
                    <td>
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
