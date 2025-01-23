import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const CartDataPage = () => {
  const [carts, setCarts] = useState([]);
  const [filteredCarts, setFilteredCarts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart data from the API
  useEffect(() => {
    const fetchCarts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/carts`);
        setCarts(response.data);
        setFilteredCarts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching cart data.");
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  // Filter carts based on the search input
  useEffect(() => {
    setFilteredCarts(
      carts.filter(
        (cart) =>
          cart.id.toString().includes(search) ||
          (cart.userName && cart.userName.toLowerCase().includes(search.toLowerCase())) ||
          (cart.userEmail && cart.userEmail.toLowerCase().includes(search.toLowerCase())) ||
          cart.items.some((item) =>
            item.productName && item.productName.toLowerCase().includes(search.toLowerCase())
          )
      )
    );
  }, [search, carts]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">All Carts</h1>

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search by Cart ID, Name, Email, or Product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-2 border">Cart ID</th>
              <th className="px-4 py-2 border">User Name</th>
              <th className="px-4 py-2 border">User Email</th>
              <th className="px-4 py-2 border">Items</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {filteredCarts.length > 0 ? (
              filteredCarts.map((cart) => (
                <tr key={cart.id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border">{cart.id}</td>
                  <td className="px-4 py-2 border">{cart.userName || "N/A"}</td>
                  <td className="px-4 py-2 border">{cart.userEmail || "N/A"}</td>
                  <td className="px-4 py-2 border">
                    <ul>
                      {cart.items.map((item, index) => (
                        <li key={index} className="text-left">
                          <div>
                            <strong>Product:</strong> {item.productName || "N/A"} <br />
                            <strong>Price:</strong> ₹{item.productPrice || "N/A"} <br />
                            <strong>Quantity:</strong> {item.quantity || "N/A"}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 border">{new Date(cart.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{new Date(cart.updatedAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No carts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CartDataPage;
