import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const CategoryDataPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch category data from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/categories`);
        setCategories(response.data || []);
        setFilteredCategories(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching categories.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on the search input
  useEffect(() => {
    setFilteredCategories(
      categories.filter(
        (category) =>
          category.id.toString().includes(search) ||
          (category.name && category.name.toLowerCase().includes(search.toLowerCase()))
      )
    );
  }, [search, categories]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">All Categories</h1>

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search by Category ID or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border">{category.id}</td>
                  <td className="px-4 py-2 border">{category.name}</td>
                  <td className="px-4 py-2 border">
                    {new Date(category.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(category.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryDataPage;
