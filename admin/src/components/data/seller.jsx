import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url"; // Update the base URL for your API

const SellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/sellers`);
        setSellers(response.data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching sellers data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sellers</h1>

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
      {!loading && !error && sellers.length === 0 && (
        <div>No sellers data available.</div>
      )}
      {!loading && !error && sellers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
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
              {sellers.map((seller) => (
                <tr key={seller.id}>
                  <td className="px-4 py-2 border">{seller.name || "N/A"}</td>
                  <td className="px-4 py-2 border">{seller.email || "N/A"}</td>
                  <td className="px-4 py-2 border">{seller.mobile || "N/A"}</td>
                  <td className="px-4 py-2 border">
                    {seller.companyName || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {seller.products.length > 0 ? (
                      <ul>
                        {seller.products.map((product, index) => (
                          <li key={index}>
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
                      <ul>
                        {seller.interestedUsers.map((interest, index) => (
                          <li key={index}>
                            {interest.userName} ({interest.userEmail}) -{" "}
                            {interest.productName} - ₹{interest.productPrice}
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
