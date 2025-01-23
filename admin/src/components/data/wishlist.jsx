import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../config/url"; // Replace with your backend API base URL

const WishlistPage = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredWishlists, setFilteredWishlists] = useState([]);

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/wishlists`); // API endpoint to fetch all wishlists
        setWishlists(response.data);
        setFilteredWishlists(response.data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching wishlists.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = wishlists.filter(
      (wishlist) =>
        wishlist.user.userName?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        wishlist.user.userEmail?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        wishlist.items.some((item) =>
          item.productName.toLowerCase().includes(e.target.value.toLowerCase())
        ) ||
        wishlist.id?.toString().includes(e.target.value)
    );
    setFilteredWishlists(filtered);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Wishlist</h1>

      <input
        type="text"
        placeholder="Search by User Name, Product Name, or Email"
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
      {!loading && !error && filteredWishlists.length === 0 && (
        <div className="text-center text-gray-700">No wishlist data available.</div>
      )}
      {!loading && !error && filteredWishlists.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="px-4 py-2 border">User Name</th>
                <th className="px-4 py-2 border">User Email</th>
                <th className="px-4 py-2 border">Items</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredWishlists.map((wishlist) => (
                <tr key={wishlist.id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border">
                    {wishlist.user.userName || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {wishlist.user.userEmail || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {wishlist.items.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {wishlist.items.map((item, index) => (
                          <li key={index} className="text-left">
                            {item.productName} - ₹{item.productPrice} (
                            {item.productCategory || "N/A"})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No Items"
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(wishlist.createdAt).toLocaleDateString()}
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

export default WishlistPage;
