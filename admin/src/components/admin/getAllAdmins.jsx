import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/get-all-admin");
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error.message);
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-admin/${id}`);
      setAdmins(admins.filter((admin) => admin._id !== id));
      alert("Admin deleted successfully!");
    } catch (error) {
      console.error("Error deleting admin:", error.message);
    }
  };

  const handleBlockToggle = async (id, isBlocked) => {
    try {
      const endpoint = isBlocked
        ? `http://localhost:5000/api/admin/unblock-admin/${id}`
        : `http://localhost:5000/api/admin/block-admin/${id}`;
      await axios.put(endpoint);
      setAdmins(
        admins.map((admin) =>
          admin._id === id ? { ...admin, isBlocked: !isBlocked } : admin
        )
      );
      alert(`Admin ${isBlocked ? "unblocked" : "blocked"} successfully!`);
    } catch (error) {
      console.error("Error toggling block status:", error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Admins</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td className="border px-4 py-2">{admin._id}</td>
              <td className="border px-4 py-2">{admin.name}</td>
              <td className="border px-4 py-2">{admin.email}</td>
              <td className="border px-4 py-2">{admin.role}</td>
              <td className="border px-4 py-2">
                {admin.isBlocked ? "Blocked" : "Active"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleBlockToggle(admin._id, admin.isBlocked)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  {admin.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => handleDelete(admin._id)}
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

export default ManageAdmins;
