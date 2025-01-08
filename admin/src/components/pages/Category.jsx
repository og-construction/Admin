import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", id: null });

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/category/get-all`);
      console.log("Fetched Categories:", response.data); // Debug API response
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    form.id ? await updateCategory() : await createCategory();
  };

  const createCategory = async () => {
    try {
      await axios.post(`${baseurl}/api/category`, { name: form.name });
      setForm({ name: "", id: null });
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error.message);
    }
  };

  const updateCategory = async () => {
    try {
      await axios.put(`${baseurl}/api/category/${form.id}`, { name: form.name });
      setForm({ name: "", id: null });
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/category/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error.message);
    }
  };

  const handleEdit = (category) => {
    setForm({ name: category.name, id: category._id });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Category Management</h1>

      <div className="bg-white shadow-md p-6 rounded-lg mb-6">
        <form onSubmit={handleFormSubmit} className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 border rounded-lg flex-1"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            {form.id ? "Update" : "Create"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm({ name: "", id: null })}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading categories...</p>
      ) : categories.length > 0 ? (
        <div className="bg-white shadow-md p-4 rounded-lg">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{category._id}</td>
                  <td className="border px-4 py-2">{category.name}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No categories found.</p>
      )}
    </div>
  );
};

export default CategoryManagement;
