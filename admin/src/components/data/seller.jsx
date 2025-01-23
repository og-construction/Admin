import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url"; // Update the base URL for your API

const SellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredSellers, setFilteredSellers] = useState([]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/sellers`);
        setSellers(response.data);
        setFilteredSellers(response.data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching sellers data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = sellers.filter(
      (seller) =>
        seller.name?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        seller.email?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        seller.id?.toString().includes(e.target.value) ||
        seller.products.some((product) =>
          product.productName.toLowerCase().includes(e.target.value.toLowerCase())
        )
    );
    setFilteredSellers(filtered);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sellers</h1>

      <input
        type="text"
        placeholder="Search by Seller Name, Product Name, or Email"
        value={search}
        onChange={handleSearch}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

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
      {!loading && !error && filteredSellers.length === 0 && (
        <div className="text-center text-gray-700">No sellers data available.</div>
      )}
      {!loading && !error && filteredSellers.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="px-4 py-2 border">Seller Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Mobile</th>
                <th className="px-4 py-2 border">Company Name</th>
                <th className="px-4 py-2 border">Products</th>
                <th className="px-4 py-2 border">Interested Users</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map((seller) => (
                <tr key={seller.id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border">{seller.name || "N/A"}</td>
                  <td className="px-4 py-2 border">{seller.email || "N/A"}</td>
                  <td className="px-4 py-2 border">{seller.mobile || "N/A"}</td>
                  <td className="px-4 py-2 border">{seller.companyName || "N/A"}</td>
                  <td className="px-4 py-2 border">
                    {seller.products.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {seller.products.map((product, index) => (
                          <li key={index} className="text-left">
                            {product.productName} - ₹{product.productPrice} (
                            {product.productCategory || "N/A"})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No Products"
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {seller.interestedUsers.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {seller.interestedUsers.map((interest, index) => (
                          <li key={index} className="text-left">
                            {interest.userName} ({interest.userEmail}) - {interest.productName} - ₹
                            {interest.productPrice}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No Interested Users"
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(seller.createdAt).toLocaleDateString()}
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

export default SellersPage;
