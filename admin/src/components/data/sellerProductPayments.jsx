import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const SellerProductVisibilityPage = () => {
  const [visibilityData, setVisibilityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const fetchSellerProductVisibility = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/sellerPayment`);
        setVisibilityData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProductVisibility();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = visibilityData.filter((record) =>
      record.seller.sellerName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Seller Product Visibility</h1>

      <input
        type="text"
        placeholder="Search by Seller Name"
        value={search}
        onChange={handleSearch}
        className="p-2 border rounded mb-4"
      />

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
      {!loading && !error && filteredData.length === 0 && (
        <div>No data available.</div>
      )}
      {!loading && !error && filteredData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Seller Name</th>
                <th className="px-4 py-2 border">Seller Email</th>
                <th className="px-4 py-2 border">Products</th>
                <th className="px-4 py-2 border">Total Amount</th>
                <th className="px-4 py-2 border">Payment Details</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-2 border">
                    {record.seller.sellerName || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {record.seller.sellerEmail || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {record.products.length > 0 ? (
                      <ul>
                        {record.products.map((product, index) => (
                          <li key={index}>
                            {product.productName} - ₹{product.productPrice} (
                            Visibility Level: {product.visibilityLevel})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No Products"
                    )}
                  </td>
                  <td className="px-4 py-2 border">₹{record.totalAmount}</td>
                  <td className="px-4 py-2 border">
                    Order ID: {record.paymentDetails.orderCreationId || "N/A"}{" "}
                    <br />
                    Razorpay ID: {record.paymentDetails.razorpayOrderId || "N/A"}{" "}
                    <br />
                    Status: {record.paymentDetails.paymentStatus || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded mx-1 ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductVisibilityPage;
