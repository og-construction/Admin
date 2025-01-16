import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const SubcategoryManagement = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", category: "", id: null });
  const [error, setError] = useState(""); // Track form or API errors
  const [success, setSuccess] = useState(""); // Track successful actions

  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/subcategory`, config);
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error.message);
      setError("Failed to load subcategories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/category/get-all`, config);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim()) {
      setError("Both subcategory name and category are required.");
      return;
    }

    try {
      setError("");
      form.id ? await updateSubcategory() : await createSubcategory();
      setSuccess(form.id ? "Subcategory updated successfully!" : "Subcategory created successfully!");
    } catch (error) {
      console.error("Error saving subcategory:", error.message);
      setError("Failed to save subcategory. Please try again.");
    }
  };

  const createSubcategory = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      if (form.image) {
        formData.append("image", form.image); // Append image only if selected
      }
  
      console.log("FormData being sent:");
      formData.forEach((value, key) => console.log(`${key}: ${value}`));
  
      await axios.post(`${baseurl}/api/subcategory`, formData, config);
      setForm({ name: "", category: "", image: null, id: null });
      fetchSubcategories();
    } catch (error) {
      console.error("Error creating subcategory:", error.message);
      setError("Failed to create subcategory. Please try again.");
    }
  };
  

  const updateSubcategory = async () => {
    try {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("category", form.category);
        if (form.image) formData.append("image", form.image);

        console.log("FormData being sent:");
        formData.forEach((value, key) => console.log(`${key}:`, value));

        await axios.put(`${baseurl}/api/subcategory/${form.id}`, formData, config);
        setForm({ name: "", category: "", image: null, id: null });
        fetchSubcategories();
    } catch (error) {
        console.error("Error updating subcategory:", error.message);
    }
};



  const deleteSubcategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;

    try {
      await axios.delete(`${baseurl}/api/subcategory/${id}`, config);
      setSuccess("Subcategory deleted successfully!");
      fetchSubcategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error.message);
      setError("Failed to delete subcategory. Please try again.");
    }
  };

  const handleEdit = (subcategory) => {
    setForm({ name: subcategory.name, category: subcategory.category._id, id: subcategory._id });
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600 animate-pulse">Loading Subcategories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50 py-10 px-4 lg:px-16">
      <div className="relative flex flex-col">
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
            Subcategory Management
          </h1>

          {/* Error and Success Messages */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-wrap gap-4 items-center"
              encType="multipart/form-data"
            >
              <input
                type="text"
                placeholder="Subcategory Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-3 border rounded-lg flex-1"
                required
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="p-3 border rounded-lg flex-1"
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
                className="p-3 border rounded-lg flex-1"
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
                  onClick={() => setForm({ name: "", category: "", id: null })}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            {subcategories.length > 0 ? (
              <table className="table-auto w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                    <th className="px-6 py-4 text-left font-bold">ID</th>
                    <th className="px-6 py-4 text-left font-bold">Name</th>
                    <th className="px-6 py-4 text-left font-bold">Category</th>
                    <th className="px-6 py-4 text-left font-bold">Image</th>
                    <th className="px-6 py-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories.map((subcategory, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } hover:bg-gray-200 transition-colors duration-300`}
                    >
                      <td className="px-6 py-4 text-gray-800 font-semibold">{subcategory._id}</td>
                      <td className="px-6 py-4 text-gray-700">{subcategory.name}</td>
                      <td className="px-6 py-4 text-gray-700">{subcategory.category.name}</td>
                      <td className="px-6 py-4">
                        <img
                          src={`${baseurl}${subcategory.image}`}
                          alt={subcategory.name}
                          className="w-32 h-24 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                        />
                      </td>
                      <td className="px-6 py-4 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(subcategory)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSubcategory(subcategory._id)}
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
                No subcategories found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryManagement;
