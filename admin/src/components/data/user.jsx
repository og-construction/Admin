import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";
const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/all-users`); // Adjust the API endpoint as needed
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
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
            {users.map((user) => (
              <tr key={user.id} className="text-center border-t">
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsersPage;
