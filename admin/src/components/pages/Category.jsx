import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", id: null });
  const [error, setError] = useState(""); // Track form or API errors
  const [success, setSuccess] = useState(""); // Track successful actions

  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Attach token as Bearer
    },
  };
  



  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseurl}/api/category/get-all`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    try {
      setError("");
      form.id ? await updateCategory() : await createCategory();
      setSuccess(form.id ? "Category updated successfully!" : "Category created successfully!");
    } catch (error) {
      console.error("Error saving category:", error.message);
      setError("Failed to save category. Please try again.");
    }
  };

  // Create a new category
 
const createCategory = async () => {
  try {
    await axios.post(`${baseurl}/api/category`, { name: form.name }, config);
    setForm({ name: "", id: null });
    fetchCategories();
  } catch (error) {
    console.error("Error creating category:", error.message);
    setError("Failed to create category. Please try again.");
  }
};

  // Update an existing category
  const updateCategory = async () => {
    await axios.put(`${baseurl}/api/category/${form.id}`, { name: form.name },config);
    setForm({ name: "", id: null });
    fetchCategories();
  };

  // Delete a category
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${baseurl}/api/category/${id}`,config);
      setSuccess("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error.message);
      setError("Failed to delete category. Please try again.");
    }
  };

  // Handle edit action
  const handleEdit = (category) => {
    setForm({ name: category.name, id: category._id });
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600 animate-pulse">
          Loading Categories...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50 py-10 px-4 lg:px-16">
      <div className="relative flex flex-col">
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
            Category Management
          </h1>

          {/* Error and Success Messages */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-wrap gap-4 items-center"
            >
              <input
                type="text"
                placeholder="Category Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-3 border rounded-lg flex-1"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                {form.id ? "Update" : "Create"}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={() => setForm({ name: "", id: null })}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            {categories.length > 0 ? (
              <table className="table-auto w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                    <th className="px-6 py-4 text-left font-bold">ID</th>
                    <th className="px-6 py-4 text-left font-bold">Name</th>
                    <th className="px-6 py-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } hover:bg-gray-200 transition-colors duration-300`}
                    >
                      <td className="px-6 py-4 text-gray-800 font-semibold">
                        {category._id}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEdit(category)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCategory(category._id)}
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
              <p className="px-6 py-4 text-center text-gray-600 font-medium">
                No categories found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
