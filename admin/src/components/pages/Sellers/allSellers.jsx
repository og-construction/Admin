import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../../config/url";

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null); // For editing a seller
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Attach token as Bearer
    },
  };

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/seller/all-seller`, config);
        setSellers(response.data);
        setFilteredSellers(response.data); // Initialize filtered sellers with all sellers
      } catch (error) {
        console.error("Error fetching sellers:", error.message);
        setError("Failed to load sellers. Please try again.");
      }
    };

    fetchSellers();
  }, []);

  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    setSearchTerm(search);

    const filtered = sellers.filter(
      (seller) =>
        seller.name.toLowerCase().includes(search) || seller._id.toLowerCase().includes(search)
    );
    setFilteredSellers(filtered);
  };

  const handleBlockToggle = async (id, isBlocked) => {
    try {
      const endpoint = isBlocked
        ? `${baseurl}/api/admin/unblock-seller/${id}`
        : `${baseurl}/api/admin/block-seller/${id}`;
      await axios.put(endpoint, {}, config);
      setSellers(
        sellers.map((seller) =>
          seller._id === id ? { ...seller, isBlocked: !isBlocked } : seller
        )
      );
      setFilteredSellers(
        filteredSellers.map((seller) =>
          seller._id === id ? { ...seller, isBlocked: !isBlocked } : seller
        )
      );
      alert(`Seller ${isBlocked ? "unblocked" : "blocked"} successfully!`);
    } catch (error) {
      console.error("Error toggling block status:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/admin/delete-seller/${id}`, config);
      const updatedSellers = sellers.filter((seller) => seller._id !== id);
      setSellers(updatedSellers);
      setFilteredSellers(updatedSellers);
      alert("Seller deleted successfully!");
    } catch (error) {
      console.error("Error deleting seller:", error.message);
    }
  };

  const handleEditSeller = (seller) => {
    setSelectedSeller(seller); // Set the seller for editing
  };


  const handleUpdateSeller = async (e) => {
    e.preventDefault();
    try {
        const { _id, name, email, mobile, password } = selectedSeller;
        const updateData = { name, email, mobile };
        if (password) updateData.password = password; // Include password only if provided
        
        await axios.put(`${baseurl}/api/admin/update-seller/${_id}`, updateData, config);
      
    } catch (error) {
        console.error("Error updating seller:", error.message);
    }
};

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50 py-10 px-4 lg:px-16">
      <div className="relative flex flex-col">
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Manage Sellers</h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by ID or Name"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            {filteredSellers.length > 0 ? (
              <table className="table-auto w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                    <th className="px-6 py-4 text-left font-bold">ID</th>
                    <th className="px-6 py-4 text-left font-bold">Name</th>
                    <th className="px-6 py-4 text-left font-bold">Email</th>
                    <th className="px-6 py-4 text-left font-bold">Mobile</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                    <th className="px-6 py-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.map((seller, index) => (
                    <tr
                      key={seller._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } hover:bg-gray-200 transition-colors duration-300`}
                    >
                      <td className="px-6 py-4 text-gray-800 font-semibold">{seller._id}</td>
                      <td className="px-6 py-4 text-gray-700">{seller.name}</td>
                      <td className="px-6 py-4 text-gray-700">{seller.email}</td>
                      <td className="px-6 py-4 text-gray-700">{seller.mobile}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {seller.isBlocked ? "Blocked" : "Active"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEditSeller(seller)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleBlockToggle(seller._id, seller.isBlocked)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2"
                        >
                          {seller.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => handleDelete(seller._id)}
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
                No sellers found.
              </p>
            )}
          </div>

          {/* Edit Seller Form */}
          {selectedSeller && (
            <div className="mt-6 p-4 bg-white shadow-lg rounded-lg">
              <h2 className="text-xl font-bold mb-4">Edit Seller</h2>
              <form onSubmit={handleUpdateSeller} className="space-y-4">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={selectedSeller.name}
                    onChange={(e) =>
                      setSelectedSeller({ ...selectedSeller, name: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    value={selectedSeller.email}
                    onChange={(e) =>
                      setSelectedSeller({ ...selectedSeller, email: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Mobile</label>
                  <input
                    type="text"
                    value={selectedSeller.mobile}
                    onChange={(e) =>
                      setSelectedSeller({ ...selectedSeller, mobile: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div>
    <label className="block text-gray-700">Password</label>
    <input
        type="password"
        value={selectedSeller.password || ""}
        onChange={(e) =>
            setSelectedSeller({ ...selectedSeller, password: e.target.value })
        }
        className="w-full p-3 border rounded-lg"
    />
</div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSeller(null)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSellers;
