import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../../config/url";

const SaleByOGCSPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Fetch products with saleType "Sale By OGCS"
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/product`);
        console.log("API Response:", response.data);

        const data = Array.isArray(response.data) ? response.data : response.data.products;
        const ogcsProducts = data.filter((product) => product.saleType === "Sale By OGCS");

        setProducts(ogcsProducts);
      } catch (error) {
        console.error("Error fetching OGCS products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleActionClick = async (productId) => {
    try {
      const response = await axios.get(`${baseurl}/api/seller/product-details/${productId}`);
      console.log("Product Details:", response.data);
      setSelectedProduct(response.data);
      setShowSidebar(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-white to-green-100 p-8">
      <h1 className="text-4xl font-bold text-green-600 text-center mb-8 shadow-sm">
        Sale By OGCS
      </h1>
      <div className="relative flex">
        {/* Product List */}
        <div className={`flex-1 bg-white shadow-lg rounded-lg p-6 ${showSidebar ? "mr-96" : ""}`}>
          <table className="table-auto w-full text-left border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-green-200 text-gray-700">
                <th className="p-4 border border-gray-300 font-medium text-lg">Product Name</th>
                <th className="p-4 border border-gray-300 font-medium text-lg">Price</th>
                <th className="p-4 border border-gray-300 font-medium text-lg">Stock</th>
                <th className="p-4 border border-gray-300 font-medium text-lg">Visibility Level</th>
                <th className="p-4 border border-gray-300 font-medium text-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-green-50 transition duration-300">
                  <td className="p-4 border border-gray-300">{product.name}</td>
                  <td className="p-4 border border-gray-300">{product.price}</td>
                  <td className="p-4 border border-gray-300">{product.stock}</td>
                  <td className="p-4 border border-gray-300">
                    {product.visibilityLevel || "N/A"}
                  </td>
                  <td className="p-4 border border-gray-300">
                    <button
                      onClick={() => handleActionClick(product._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

     {/* Sidebar */}
{showSidebar && selectedProduct && (
  <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-r from-white to-green-50 shadow-2xl p-6 overflow-y-auto z-50">
    <button
      className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
      onClick={closeSidebar}
    >
      &times;
    </button>
    <h2 className="text-3xl font-bold text-green-700 mb-6 border-b pb-2">
       {selectedProduct.name}
    </h2>
    <div className="space-y-6 text-sm">
      <p className="text-gray-700">
        <span className="font-semibold text-green-600">Description:</span> {selectedProduct.description || "No description available"}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-green-600">Price:</span> ₹{selectedProduct.price} <span className="text-sm text-gray-500">({selectedProduct.priceUnit || "per unit"})</span>
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-green-600">Available Stock:</span> {selectedProduct.stock || "Out of stock"}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-green-600">Category:</span> {selectedProduct.category?.name || "Uncategorized"}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-green-600">Subcategory:</span> {selectedProduct.subcategory?.name || "Not specified"}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-green-600">Size:</span> {selectedProduct.size || "Standard"}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-green-600">Sold Units:</span> {selectedProduct.sold || 0}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-green-600">HSN Code:</span> {selectedProduct.hsnCode || "Not available"}
      </p>
      <div>
        <p className="font-semibold text-green-600">Key Features:</p>
        <ul className="list-disc list-inside text-gray-700">
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
      <p className="text-gray-700">
        <span className="font-semibold text-green-600">👨‍💼 Seller Information:</span> {selectedProduct.seller?.name || "Not available"}
      </p>
    </div>
  </div>
)}

    </div>
  </div>
  );
};

export default SaleByOGCSPage;
