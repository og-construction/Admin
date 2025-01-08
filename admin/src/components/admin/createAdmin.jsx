import React, { useState } from "react";
import axios from "axios";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "admin",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/create-admin", formData);
      alert("Admin created successfully!");
      setFormData({ name: "", email: "", password: "", mobile: "", role: "admin" });
    } catch (error) {
      console.error("Error creating admin:", error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="admin">Admin</option>
          <option value="AccountAdmin">Account Admin</option>
          <option value="SalesAdmin">Sales Admin</option>
          <option value="technicalAdmin">Technical Admin</option>
          <option value="AnalysisAdmin">Analysis Admin</option>
        </select>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Create Admin
        </button>
      </form>
    </div>
  );
};

export default CreateAdmin;
