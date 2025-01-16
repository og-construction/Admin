import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnapprovedProducts = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/product`);
        if (response.data?.products) {
          const unapprovedProducts = response.data.products.filter(
            (product) => product.approved === false
          );
          setProducts(unapprovedProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err.response?.data?.message || "Failed to fetch unapproved products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUnapprovedProducts();
  }, []);

  const handleViewProduct = async (productId) => {
    try {
      const response = await axios.get(
        `${baseurl}/api/admin/payment-details/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSelectedProduct({
        productDetails: response.data?.productDetails || {},
        otherPayment: response.data?.otherPayment || null,
        paymentDetails: response.data?.paymentDetails || null,
      });
    } catch (err) {
      console.error("Error fetching product details:", err);
      alert(err.response?.data?.message || "Failed to fetch product details.");
    }
  };

  const closeSidebar = () => {
    setSelectedProduct(null);
  };

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
                      <td className="px-6 py-4 text-gray-700">
                        {product.maxquantity}
                      </td>
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
  <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 rounded-l-lg p-6 overflow-y-auto transition-transform transform translate-x-0">
    {/* Close Button */}
    <button
      className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl focus:outline-none"
      onClick={closeSidebar}
    >
      &times;
    </button>

    {/* Header */}
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
      {selectedProduct.productDetails?.name || "Product Name"}
    </h2>

    {/* Product Details */}
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-blue-600">Product Details</h3>
        <div className="text-sm text-gray-700 mt-2">
          <p><span className="font-medium">Description:</span> {selectedProduct.productDetails?.description || "N/A"}</p>
          <p><span className="font-medium">Price:</span> ₹{selectedProduct.productDetails?.price || "N/A"}</p>
          <p><span className="font-medium">Max Quantity:</span> {selectedProduct.productDetails?.maxquantity || "N/A"}</p>
          <p><span className="font-medium">Min Quantity:</span> {selectedProduct.productDetails?.minquantity || "N/A"}</p>
          <p><span className="font-medium">Stock:</span> {selectedProduct.productDetails?.stock || "N/A"}</p>
          <p><span className="font-medium">Category:</span> {selectedProduct.productDetails?.category || "N/A"}</p>
          <p><span className="font-medium">Subcategory:</span> {selectedProduct.productDetails?.subcategory || "N/A"}</p>
          <p><span className="font-medium">GST Number:</span> {selectedProduct.productDetails?.gstNumber || "N/A"}</p>
          <p><span className="font-medium">HSN Code:</span> {selectedProduct.productDetails?.hsnCode || "N/A"}</p>
        </div>
      </div>

      {/* Seller Details */}
      <div>
        <h3 className="text-lg font-semibold text-green-600">Seller Details</h3>
        <div className="text-sm text-gray-700 mt-2">
          <p><span className="font-medium">Name:</span> {selectedProduct.productDetails?.seller?.name || "N/A"}</p>
          <p><span className="font-medium">Email:</span> {selectedProduct.productDetails?.seller?.email || "N/A"}</p>
          <p><span className="font-medium">Mobile:</span> {selectedProduct.productDetails?.seller?.mobile || "N/A"}</p>
          <p><span className="font-medium">Address:</span> {selectedProduct.productDetails?.seller?.address?.street || "N/A"}, {selectedProduct.productDetails?.seller?.address?.city || "N/A"}, {selectedProduct.productDetails?.seller?.address?.state || "N/A"}, {selectedProduct.productDetails?.seller?.address?.country || "N/A"} - {selectedProduct.productDetails?.seller?.address?.postalCode || "N/A"}</p>
        </div>
      </div>

      {/* Other Payment Details */}
      {selectedProduct.otherPayment && (
        <div>
          <h3 className="text-lg font-semibold text-yellow-600">Other Payment</h3>
          <div className="text-sm text-gray-700 mt-2">
            <p><span className="font-medium">Method:</span> {selectedProduct.otherPayment.method}</p>
            <p><span className="font-medium">Amount:</span> ₹{selectedProduct.otherPayment.amount}</p>
            <p><span className="font-medium">Date:</span> {new Date(selectedProduct.otherPayment.date).toLocaleDateString()}</p>
            <p><span className="font-medium">Bank Name:</span> {selectedProduct.otherPayment.bankName}</p>
            <p><span className="font-medium">Account Number:</span> {selectedProduct.otherPayment.accountNumber}</p>
            <p><span className="font-medium">IFSC Code:</span> {selectedProduct.otherPayment.ifscCode}</p>
            <p><span className="font-medium">Transaction Id:</span>
            {selectedProduct.otherPayment.transactionId}</p>

          </div>
        </div>
      )}

      {/* Payment Details */}
      <div>
        <h3 className="text-lg font-semibold text-purple-600">Payment Details</h3>
        <div className="text-sm text-gray-700 mt-2">
          {selectedProduct.paymentDetails?.products.map((product, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              <p><span className="font-medium">Product ID:</span> {product.productId || "N/A"}</p>
              <p><span className="font-medium">Product Name:</span> {product.productName || "N/A"}</p>
              <p><span className="font-medium">Visibility Level:</span> {product.visibilityLevel || "N/A"}</p>
              <p><span className="font-medium">Visibility Amount:</span> ₹{product.visibilityAmount || "N/A"}</p>
              <p><span className="font-medium">Power Pack:</span> {product.powerPack ? "Yes" : "No"}</p>
              <p><span className="font-medium">Power Pack Amount:</span> ₹{product.powerPackAmount || "N/A"}</p>
              <p><span className="font-medium">Total Product Amount:</span> ₹{product.totalProductAmount || "N/A"}</p>
            </div>
          ))}
          <p><span className="font-medium">Total Amount:</span> ₹{selectedProduct.paymentDetails?.totalAmount || "N/A"}</p>
          <p><span className="font-medium">Payment Status:</span> {selectedProduct.paymentDetails?.paymentStatus || "N/A"}</p>
          <p><span className="font-medium">Razorpay Order ID:</span> {selectedProduct.paymentDetails?.razorpayOrderId || "N/A"}</p>
          <p><span className="font-medium">Razorpay Payment ID:</span> {selectedProduct.paymentDetails?.razorpayPaymentId || "N/A"}</p>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default SellerProductsPage;
