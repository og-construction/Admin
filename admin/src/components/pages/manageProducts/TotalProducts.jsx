import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TotalProducts = () => {
  const navigate = useNavigate();

  // Sample data for the table (replace with dynamic data if needed)
  const initialProducts = [
    {
      id: 1,
      name: "CEMENT",
      price: "400.00",
      maxQuantity: 50,
      minQuantity: 10,
      stock: 100,
      category: "Hand Tools",
      seller: "Akash Pawar",
      date: "2025-01-04",
    },
    {
      id: 2,
      name: "Hammer",
      price: "500.00",
      maxQuantity: 30,
      minQuantity: 5,
      stock: 50,
      category: "Hand Tools",
      seller: "Akash Pawar",
      date: "2025-01-03",
    },
    {
      id: 3,
      name: "Drill Machine",
      price: "800.00",
      maxQuantity: 20,
      minQuantity: 5,
      stock: 10,
      category: "Power Tools",
      seller: "Sanika Kashid",
      date: "2025-01-02",
    },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter products based on search query and date range
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.id.toString().includes(search) ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.seller.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const withinDateRange =
      (!startDate || new Date(product.date) >= new Date(startDate)) &&
      (!endDate || new Date(product.date) <= new Date(endDate));

    return matchesSearch && withinDateRange;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Total Products Page</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Product Id, Name, Seller, or Category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date Filters */}
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block text-gray-600 mb-1">Select Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* <div>
          <label className="block text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 text-left">Product Id</th>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Seller</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Max Quantity</th>
              <th className="px-4 py-2 text-left">Min Quantity</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Purchased Date</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="px-4 py-2">{product.id}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.seller}</td>
                  <td className="px-4 py-2">{product.price}</td>
                  <td className="px-4 py-2">{product.maxQuantity}</td>
                  <td className="px-4 py-2">{product.minQuantity}</td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2">{product.date}</td>
                  <td className="px-4 py-2 text-center">
                    {/* Action Icon */}
                    <FaEye
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={() => navigate(`/products/details/${product.id}`)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-2 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalProducts;
