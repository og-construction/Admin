import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const SubcategoryManagement = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", category: "", id: null });

  // Fetch all subcategories
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/subcategory`);
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/category/get-all`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    form.id ? await updateSubcategory() : await createSubcategory();
  };

  // Create a new subcategory
  const createSubcategory = async () => {
    try {
      await axios.post(`${baseurl}/api/subcategory`, {
        name: form.name,
        category: form.category,
      });
      setForm({ name: "", category: "", id: null });
      fetchSubcategories();
    } catch (error) {
      console.error("Error creating subcategory:", error.message);
    }
  };

  // Update an existing subcategory
  const updateSubcategory = async () => {
    try {
      await axios.put(`${baseurl}/api/subcategory/${form.id}`, {
        name: form.name,
        category: form.category,
      });
      setForm({ name: "", category: "", id: null });
      fetchSubcategories();
    } catch (error) {
      console.error("Error updating subcategory:", error.message);
    }
  };

  // Delete a subcategory
  const deleteSubcategory = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/subcategory/${id}`);
      fetchSubcategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error.message);
    }
  };

  // Handle editing a subcategory
  const handleEdit = (subcategory) => {
    setForm({ name: subcategory.name, category: subcategory.category._id, id: subcategory._id });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Subcategory Management</h1>

      {/* Form for creating/updating subcategories */}
      <div className="bg-white shadow-md p-6 rounded-lg mb-6">
      <form onSubmit={handleFormSubmit} className="flex flex-wrap gap-4">
    <input
        type="text"
        placeholder="Subcategory Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="p-2 border rounded-lg flex-1"
        required
    />
    <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="p-2 border rounded-lg flex-1"
        required
    >
        <option value="">Select Category</option>
        {categories.map((category) => (
            <option key={category._id} value={category._id}>
                {category.name}
            </option>
        ))}
    </select>
    <input
        type="file"
        accept="image/*"
        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        className="p-2 border rounded-lg"
        required
    />
    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        {form.id ? "Update" : "Create"}
    </button>
    {form.id && (
        <button
            type="button"
            onClick={() => setForm({ name: "", category: "", image: null, id: null })}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
            Cancel
        </button>
    )}
</form>

      </div>

      {/* Subcategories List */}
      {loading ? (
        <p className="text-center text-gray-600">Loading subcategories...</p>
      ) : subcategories.length > 0 ? (
        <div className="bg-white shadow-md p-4 rounded-lg">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
    {subcategories.map((subcategory) => (
        <tr key={subcategory._id} className="hover:bg-gray-50">
            <td className="border px-4 py-2">{subcategory._id}</td>
            <td className="border px-4 py-2">{subcategory.name}</td>
            <td className="border px-4 py-2">{subcategory.category.name}</td>
            <td className="border px-4 py-2">
                <img
                    src={`${baseurl}/api/${subcategory.image}`}
                    alt={subcategory.name}
                    className="h-16 w-16 object-cover"
                />
            </td>
            <td className="border px-4 py-2 text-center">
                <button
                    onClick={() => handleEdit(subcategory)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 mr-2"
                >
                    Edit
                </button>
                <button
                    onClick={() => deleteSubcategory(subcategory._id)}
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
        <p className="text-center text-gray-600">No subcategories found.</p>
      )}
    </div>
  );
};

export default SubcategoryManagement;
