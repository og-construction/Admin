import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const CartDataPage = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart data from the API
  useEffect(() => {
    const fetchCarts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/carts`); // Adjust the API endpoint as needed
        setCarts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching cart data.");
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Carts</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Cart ID</th>
              <th className="px-4 py-2 border">User Name</th>
              <th className="px-4 py-2 border">User Email</th>
              <th className="px-4 py-2 border">Items</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => (
              <tr key={cart.id} className="text-center border-t">
                <td className="px-4 py-2 border">{cart.id}</td>
                <td className="px-4 py-2 border">{cart.userName || "N/A"}</td>
                <td className="px-4 py-2 border">{cart.userEmail || "N/A"}</td>
                <td className="px-4 py-2 border">
                  <ul>
                    {cart.items.map((item, index) => (
                      <li key={index}>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CartDataPage;
