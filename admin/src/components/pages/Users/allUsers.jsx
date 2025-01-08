import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../../config/url";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUsersCount, setNewUsersCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/users`);
        setUsers(response.data);

        // Assuming the API provides a `createdAt` field for user creation date
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        const newUsers = response.data.filter((user) => 
          user.createdAt && user.createdAt.startsWith(today)
        );
        setNewUsersCount(newUsers.length);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const handleBlock = async (id, isBlocked) => {
    try {
      await axios.put(
        `${baseurl}/api/users/${id}/${isBlocked ? "unblock" : "block"}`
      );
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, isBlocked: !isBlocked } : user
        )
      );
      alert(`User ${isBlocked ? "unblocked" : "blocked"} successfully!`);
    } catch (error) {
      console.error("Error blocking/unblocking user:", error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      {/* Summary Boxes */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">New Users Today</h3>
          <p className="text-2xl font-bold text-green-600">{newUsersCount}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{users.length}</p>
        </div>
      </div>

      {/* Users Table */}
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
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{user._id}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                {user.isBlocked ? "Blocked" : "Active"}
              </td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleBlock(user._id, user.isBlocked)}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(user._id)}
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

export default AllUsers;
