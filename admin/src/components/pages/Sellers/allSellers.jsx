import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/sellers");
        setSellers(response.data);
      } catch (error) {
        console.error("Error fetching sellers:", error.message);
      }
    };

    fetchSellers();
  }, []);

  const handleBlockToggle = async (id, isBlocked) => {
    try {
      const endpoint = isBlocked
        ? `http://localhost:5000/api/admin/sellers/${id}/unblock`
        : `http://localhost:5000/api/admin/sellers/${id}/block`;
      await axios.put(endpoint);
      setSellers(
        sellers.map((seller) =>
          seller._id === id ? { ...seller, isBlocked: !isBlocked } : seller
        )
      );
      alert(`Seller ${isBlocked ? "unblocked" : "blocked"} successfully!`);
    } catch (error) {
      console.error("Error toggling block status:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/sellers/${id}`);
      setSellers(sellers.filter((seller) => seller._id !== id));
      alert("Seller deleted successfully!");
    } catch (error) {
      console.error("Error deleting seller:", error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Sellers</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller) => (
            <tr key={seller._id}>
              <td className="border px-4 py-2">{seller._id}</td>
              <td className="border px-4 py-2">{seller.name}</td>
              <td className="border px-4 py-2">{seller.email}</td>
              <td className="border px-4 py-2">
                {seller.isBlocked ? "Blocked" : "Active"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleBlockToggle(seller._id, seller.isBlocked)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  {seller.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => handleDelete(seller._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSellers;
