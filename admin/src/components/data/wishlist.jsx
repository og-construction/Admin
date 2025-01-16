import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../config/url"; // Replace with your backend API base URL

const WishlistPage = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/wishlists`); // API endpoint to fetch all wishlists
        setWishlists(response.data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching wishlists.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Wishlist</h1>

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
      {!loading && !error && wishlists.length === 0 && (
        <div>No wishlist data available.</div>
      )}
      {!loading && !error && wishlists.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">User Name</th>
                <th className="px-4 py-2 border">User Email</th>
                <th className="px-4 py-2 border">Items</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {wishlists.map((wishlist) => (
                <tr key={wishlist.id}>
                  <td className="px-4 py-2 border">
                    {wishlist.user.userName || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {wishlist.user.userEmail || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {wishlist.items.length > 0 ? (
                      <ul>
                        {wishlist.items.map((item, index) => (
                          <li key={index}>
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
