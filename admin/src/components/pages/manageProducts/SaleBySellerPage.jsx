import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../../config/url";

const ApproveProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products with approved status false
  useEffect(() => {
    const fetchUnapprovedProducts = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/product`);
        console.log("API Response:", response.data);

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
      const response = await axios.put(
        `${baseurl}/approve-product/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Approve Response:", response.data);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      alert("Product approved successfully!");
      setSelectedProduct(null); // Close the sidebar
    } catch (err) {
      console.error("Error approving product:", err);
      alert(err.response ? err.response.data.message : "Error approving product");
    }
  };

  const closeSidebar = () => {
    setSelectedProduct(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-white to-green-100 p-8">
      <div className="relative flex">
        {/* Product List */}
        <div className={`flex-1 bg-white shadow-lg rounded-lg p-6 ${selectedProduct ? "mr-96" : ""}`}>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Approve Products</h1>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Product Name</th>
                  <th className="border border-gray-300 px-4 py-2">Max Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Price</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.maxquantity}</td>
                      <td className="border border-gray-300 px-4 py-2">₹{product.price}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
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
                      className="border border-gray-300 px-4 py-2 text-center text-gray-600"
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
              <p>
                <span className="font-semibold text-green-600">Description:</span>{" "}
                {selectedProduct.description || "No description available"}
              </p>
              <p>
                <span className="font-semibold text-green-600">Price:</span> ₹{selectedProduct.price}{" "}
                <span className="text-sm text-gray-500">({selectedProduct.priceUnit || "per unit"})</span>
              </p>
              <p>
                <span className="font-semibold text-green-600">Available Stock:</span>{" "}
                {selectedProduct.stock || "Out of stock"}
              </p>
              <p>
                <span className="font-semibold text-green-600">Max Quantity:</span>{" "}
                {selectedProduct.maxquantity || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-green-600">Category:</span>{" "}
                {selectedProduct.category?.name || "Uncategorized"}
              </p>
              <p className="text-gray-700">
        <span className="font-semibold text-green-600">Price:</span> ₹{selectedProduct.price} <span className="text-sm text-gray-500">({selectedProduct.priceUnit || "per unit"})</span>
      </p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleApproveProduct(selectedProduct._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 transition"
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
