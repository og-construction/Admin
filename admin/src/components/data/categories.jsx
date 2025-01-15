import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const CategoryDataPage = () => {
  const [categories, setCategories] = useState([]); // Updated variable name to categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch category data from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/categories`); // Ensure this endpoint is correct
        setCategories(response.data || []); // Set categories data, default to an empty array if undefined
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching categories.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Categories</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="text-center border-t">
                <td className="px-4 py-2 border">{category.id}</td>
                <td className="px-4 py-2 border">{category.name}</td>
                <td className="px-4 py-2 border">
                  {new Date(category.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(category.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryDataPage;
