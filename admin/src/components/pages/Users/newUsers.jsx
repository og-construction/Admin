import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../../config/url";

const NewUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/users/new`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching new users:", error.message);
      }
    };

    fetchNewUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">New Users</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewUsers;
