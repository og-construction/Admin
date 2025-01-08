import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseurl } from "../../config/url";

const SellerDetailsPage = () => { // Component name starts with an uppercase letter
  const { sellerId } = useParams(); // Get seller ID from the URL
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch seller and product details
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const sellerId = localStorage.getItem("sellerId");
        const response = await axios.get(`${baseurl}seller/${sellerId}`); // Replace with your API endpoint
        setSeller(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Error fetching seller details");
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [sellerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Seller Details</h1>

        {/* Seller Details */}
        <div className="mb-8">
          <ul className="text-gray-700">
            <li><strong>Seller Name:</strong> {seller.sellerName}</li>
            <li><strong>Email:</strong> {seller.email}</li>
            <li><strong>Mobile:</strong> {seller.mobile}</li>
            <li><strong>Address:</strong> {seller.address}</li>
            <li><strong>City:</strong> {seller.city}</li>
            <li><strong>State:</strong> {seller.state}</li>
            <li><strong>Country:</strong> {seller.country}</li>
            <li><strong>Pincode:</strong> {seller.pincode}</li>
            <li><strong>GST Number:</strong> {seller.gstNumber}</li>
            <li><strong>Visibility Level:</strong> {seller.Visibilitylevel}</li>
            <li><strong>Payment Date:</strong> {seller.paymentDate}</li>
          </ul>
        </div>

        {/* Product Details Table */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Details</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Product Name</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Stock</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Sub Category</th>
                <th className="border border-gray-300 px-4 py-2">Delivery Preference</th>
                <th className="border border-gray-300 px-4 py-2">Sale Mode</th>
              </tr>
            </thead>
            <tbody>
              {seller.products && seller.products.length > 0 ? (
                seller.products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{product.productName}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.price}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.stock}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.subCategory}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.deliveryPreference}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.saleMode}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="border border-gray-300 px-4 py-2 text-center">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDetailsPage;
