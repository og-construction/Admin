import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const InterestedUsersDataPage = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch subcategory data
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/userInterested`);
        setSubcategories(response.data || []);
        setFilteredSubcategories(response.data || []);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubcategories();
  }, []);

  // Filter subcategories based on the search input
  useEffect(() => {
    setFilteredSubcategories(
      subcategories.filter(
        (subcategory) =>
          subcategory.id.toString().includes(search) ||
          (subcategory.name && subcategory.name.toLowerCase().includes(search.toLowerCase())) ||
          (subcategory.categoryName && subcategory.categoryName.toLowerCase().includes(search.toLowerCase()))
      )
    );
  }, [search, subcategories]);

  // Pagination logic
  const paginatedData = filteredSubcategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredSubcategories.length / pageSize);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Interested Users</h1>

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search by ID, Name, or Category Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <div>Loading...</div>}
      {error && (
        <div>
          Error: {error} <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="table-auto w-full border border-gray-300">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Category Name</th>
                  <th className="px-4 py-2 border">Image</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Updated At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((subcategory) => (
                  <tr key={subcategory.id} className="text-center hover:bg-gray-100">
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
          <div className="mt-4 flex justify-center items-center space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
            <button
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InterestedUsersDataPage;
