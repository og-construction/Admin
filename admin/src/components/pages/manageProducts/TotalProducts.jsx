import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseurl } from "../../config/url";

const TotalProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${baseurl}/api/product`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600 animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-600">No products available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50 py-10 px-4 lg:px-16">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        Product Inventory
      </h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="table-auto w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
              <th className="px-6 py-4 text-left font-bold">SL</th>
              <th className="px-6 py-4 text-left font-bold">Product Name</th>
              <th className="px-6 py-4 text-left font-bold">Price</th>
              <th className="px-6 py-4 text-left font-bold">Stock</th>
              <th className="px-6 py-4 text-center font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-gray-200 transition-colors duration-300`}
              >
                <td className="px-6 py-4 text-center text-gray-700 font-medium">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-gray-800 font-semibold">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {product.price}
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-1 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-transform duration-300 transform hover:scale-105"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalProducts;
