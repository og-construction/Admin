import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/all-users`);
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on the search input
  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.id.toString().includes(search) ||
          user.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">All Users</h1>

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search by ID or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Mobile</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Verified</th>
              <th className="px-4 py-2 border">Blocked</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border">{user.id}</td>
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.mobile}</td>
                  <td className="px-4 py-2 border">{user.type}</td>
                  <td className="px-4 py-2 border">{user.isVerified ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 border">{user.isBlocked ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 border">{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{new Date(user.updatedAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsersPage;
