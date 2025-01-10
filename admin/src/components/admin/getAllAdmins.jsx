import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "admin", // Default role
    password: "",
    id: null,
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/admin/get-all-admin`);
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error.message);
        setError("Failed to load admins. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile || !form.role || (!form.id && !form.password)) {
      setError("All fields are required.");
      return;
    }

    try {
      setError("");
      form.id ? await updateAdmin() : await createAdmin();
      setSuccess(form.id ? "Admin updated successfully!" : "Admin created successfully!");
      setForm({ name: "", email: "", mobile: "", role: "admin", password: "", id: null });
    } catch (error) {
      console.error("Error saving admin:", error.message);
      setError("Failed to save admin. Please try again.");
    }
  };

  const createAdmin = async () => {
    try {
      await axios.post(`${baseurl}/api/admin/create-admin`, form);
      const response = await axios.get(`${baseurl}/api/admin/get-all-admin`);
      setAdmins(response.data);
    } catch (error) {
      console.error("Error creating admin:", error.message);
      setError(error.response?.data?.message || "Failed to create admin.");
    }
  };
  
  const updateAdmin = async () => {
    try {
      await axios.put(`${baseurl}/api/admin/update-admin/${form.id}`, {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        role: form.role,
      });
      const response = await axios.get(`${baseurl}/api/admin/get-all-admin`);
      setAdmins(response.data);
    } catch (error) {
      console.error("Error updating admin:", error.message);
      setError("Failed to update admin.");
    }
  };

  const handleEdit = (admin) => {
    setForm({
      name: admin.name,
      email: admin.email,
      mobile: admin.mobile,
      role: admin.role,
      id: admin._id,
      password: "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await axios.delete(`${baseurl}/api/admin/delete-admin/${id}`);
      setAdmins(admins.filter((admin) => admin._id !== id));
      setSuccess("Admin deleted successfully!");
    } catch (error) {
      console.error("Error deleting admin:", error.message);
      setError("Failed to delete admin.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600 animate-pulse">Loading Admins...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50 py-10 px-4 lg:px-16">
      <div className="relative flex flex-col">
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Manage Admins</h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleFormSubmit} className="flex flex-wrap gap-4 items-center">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-3 border rounded-lg flex-1"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="p-3 border rounded-lg flex-1"
                required
              />
              <input
                type="text"
                placeholder="Mobile"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="p-3 border rounded-lg flex-1"
                required
              />
             <select
  value={form.role}
  onChange={(e) => setForm({ ...form, role: e.target.value })}
  className="p-3 border rounded-lg flex-1"
>
  <option value="admin">Admin</option>
  <option value="AccountAdmin">Account Admin</option>
  <option value="SalesAdmin">Sales Admin</option>
  <option value="technicalAdmin">Technical Admin</option>
  <option value="AnalysisAdmin">Analysis Admin</option>
</select>

              {!form.id && (
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="p-3 border rounded-lg flex-1"
                  required
                />
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                {form.id ? "Update Admin" : "Create Admin"}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={() =>
                    setForm({ name: "", email: "", mobile: "", role: "admin", password: "", id: null })
                  }
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            {admins.length > 0 ? (
              <table className="table-auto w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                    <th className="px-6 py-4 text-left font-bold">ID</th>
                    <th className="px-6 py-4 text-left font-bold">Name</th>
                    <th className="px-6 py-4 text-left font-bold">Email</th>
                    <th className="px-6 py-4 text-left font-bold">Mobile</th>
                    <th className="px-6 py-4 text-left font-bold">Role</th>
                    <th className="px-6 py-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => (
                    <tr
                      key={admin._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } hover:bg-gray-200 transition-colors duration-300`}
                    >
                      <td className="px-6 py-4 text-gray-800 font-semibold">{admin._id}</td>
                      <td className="px-6 py-4 text-gray-700">{admin.name}</td>
                      <td className="px-6 py-4 text-gray-700">{admin.email}</td>
                      <td className="px-6 py-4 text-gray-700">{admin.mobile}</td>
                      <td className="px-6 py-4 text-gray-700">{admin.role}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(admin._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-6 py-4 text-center text-gray-600 font-medium">No admins found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAdmins;
