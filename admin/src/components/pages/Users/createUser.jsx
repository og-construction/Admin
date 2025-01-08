import React, { useState } from "react";
import axios from "axios";
import { baseurl } from "../../config/url";

const CreateUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    type: "B2C",
    gstNumber: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseurl}/api/users`, form);
      alert("User created successfully!");
      setForm({ name: "", email: "", password: "", mobile: "", type: "B2C", gstNumber: "" });
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Mobile"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="B2C">B2C</option>
          <option value="B2B">B2B</option>
        </select>
        {form.type === "B2B" && (
          <input
            type="text"
            placeholder="GST Number"
            value={form.gstNumber}
            onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
            className="w-full p-2 border rounded"
          />
        )}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
