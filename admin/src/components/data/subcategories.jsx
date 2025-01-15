import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const SubCategoriesDataPage = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subcategory data from the API
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/subcategories`);
        setSubcategories(response.data || []); // Default to empty array if no data
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Subcategories</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Category Name</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((subcategory) => (
              <tr key={subcategory.id} className="text-center border-t">
                <td className="px-4 py-2 border">{subcategory.id}</td>
                <td className="px-4 py-2 border">{subcategory.name}</td>
                <td className="px-4 py-2 border">{subcategory.categoryName}</td>
                <td className="px-4 py-2 border">
                  {subcategory.image ? (
                    <img
                      src={`${baseurl}${subcategory.image}`}
                      alt={subcategory.name}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(subcategory.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(subcategory.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubCategoriesDataPage;
