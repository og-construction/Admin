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
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseurl}/api/register`, form);
      alert("User created successfully!");
      setForm({
        name: "",
        email: "",
        password: "",
        mobile: "",
        type: "B2C",
        gstNumber: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      });
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  };
  
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Create User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Mobile</label>
            <input
              type="text"
              placeholder="Enter your mobile number"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="B2C">B2C</option>
              <option value="B2B">B2B</option>
            </select>
          </div>
          {form.type === "B2B" && (
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">GST Number</label>
              <input
                type="text"
                placeholder="Enter your GST number"
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col w-1/2">
              <label className="text-sm font-semibold mb-1">City</label>
              <input
                type="text"
                placeholder="Enter your city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-sm font-semibold mb-1">State</label>
              <input
                type="text"
                placeholder="Enter your state"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Zip Code</label>
            <input
              type="text"
              placeholder="Enter your zip code"
              value={form.zipCode}
              onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
