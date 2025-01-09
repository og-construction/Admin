import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../../config/url";

const ApproveProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch unapproved products
  useEffect(() => {
    const fetchUnapprovedProducts = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/product`);
        const unapprovedProducts = response.data.products.filter(
          (product) => product.approved === false
        );
        setProducts(unapprovedProducts);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchUnapprovedProducts();
  }, []);

  const handleApproveProduct = async (productId) => {
    try {
      await axios.put(
        `${baseurl}/api/admin/approve-product/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      alert("Product approved successfully!");
      setSelectedProduct(null); // Close the sidebar
    } catch (err) {
      alert(err.response ? err.response.data.message : "Error approving product");
    }
  };

  const handleViewProduct = async (productId) => {
    try {
      const response = await axios.get(`${baseurl}/api/seller/product-details/${productId}`);
      setSelectedProduct(response.data);
    } catch (err) {
      alert(err.response ? err.response.data.message : "Error fetching product details");
    }
  };

  const closeSidebar = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50 py-10 px-4 lg:px-16">
      <div className="relative flex">
        {/* Product List */}
        <div
          className={`flex-1 p-6 bg-white rounded-lg shadow-lg ${
            selectedProduct ? "mr-96" : ""
          }`}
        >
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
            Approve Products
          </h1>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="table-auto w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                  <th className="px-6 py-4 text-left font-bold">Product Name</th>
                  <th className="px-6 py-4 text-left font-bold">Max Quantity</th>
                  <th className="px-6 py-4 text-left font-bold">Price</th>
                  <th className="px-6 py-4 text-center font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr
                      key={product._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } hover:bg-gray-200 transition-colors duration-300`}
                    >
                      <td className="px-6 py-4 text-gray-800 font-semibold">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{product.maxquantity}</td>
                      <td className="px-6 py-4 text-gray-700">₹{product.price}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewProduct(product._id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-1 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-transform duration-300 transform hover:scale-105"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-600 font-medium"
                    >
                      No unapproved products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar for Product Details */}
        {selectedProduct && (
          <div className="fixed right-0 top-0 h-full w-96 bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
              onClick={closeSidebar}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {selectedProduct.name}
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <span className="font-semibold text-blue-600">Description:</span>{" "}
                {selectedProduct.description || "No description available"}
              </p>
              <p>
                <span className="font-semibold text-blue-600">Price:</span> ₹
                {selectedProduct.price} ({selectedProduct.priceUnit || "per unit"})
              </p>
              <p>
                <span className="font-semibold text-blue-600">Max Quantity:</span>{" "}
                {selectedProduct.maxquantity || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-blue-600">Category:</span>{" "}
                {selectedProduct.category?.name || "Uncategorized"}
              </p>
              <p className="text-gray-700">
        <span className="font-semibold text-blue-600">Subcategory:</span> {selectedProduct.subcategory?.name || "Not specified"}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-blue-600">Size:</span> {selectedProduct.size || "Standard"}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-blue-600">Sold Units:</span> {selectedProduct.sold || 0}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-blue-600">HSN Code:</span> {selectedProduct.hsnCode || "Not available"}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-blue-600">Available Stock:</span> {selectedProduct.stock || "Out of stock"}
      </p>

              <div>
                <span className="font-semibold text-blue-600">Specifications:</span>
                <ul className="list-disc list-inside">
                  {selectedProduct.specifications?.length > 0 ? (
                    selectedProduct.specifications.map((spec, index) => (
                      <li key={index}>
                        <span className="font-semibold">{spec.key}:</span> {spec.value}
                      </li>
                    ))
                  ) : (
                    <li>No specifications listed</li>
                  )}
                </ul>
              </div>
              <p className="text-gray-700">
        <span className="font-semibold text-green-600">👨‍💼 Seller Information:</span> {selectedProduct.seller?.name || "Not available"}
      </p>
              <div>
        <p className="font-semibold text-green-600">🖼️ Product Images:</p>
        <div className="grid grid-cols-1 gap-2">
          {selectedProduct.images?.length > 0 ? (
            selectedProduct.images.map((image, index) => (
              <div key={index} className="w-full h-40 bg-gray-100 rounded-lg shadow-md overflow-hidden">
                <img
                  src={`data:${image.contentType};base64,${image.data}`}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No images available</p>
          )}
        </div>
      </div>
              <div className="text-center">
                <button
                  onClick={() => handleApproveProduct(selectedProduct._id)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-6 rounded-lg hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition-transform duration-300 transform hover:scale-105"
                >
                  Approve Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveProductsPage;
