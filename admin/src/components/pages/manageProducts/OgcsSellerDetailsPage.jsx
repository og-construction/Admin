//D:\Admin08-01\Admin\admin\src\components\pages\manageProducts\OgcsSellerDetailsPage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseurl } from "../../config/url"; // Replace with your base URL configuration

const OgcsSellerDetailsPage = () => {
  const { id } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseurl}product/${id}`); // Replace with your API endpoint
        setProduct(response.data);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Error fetching product details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Product Details
        </h1>

        <div className="mb-8 text-gray-700">
          <ul>
            <li>
              <strong>Product Name:</strong> {product.productName}
            </li>
            <li>
              <strong>Price:</strong> {product.price}
            </li>
            <li>
              <strong>Stock:</strong> {product.stock}
            </li>
            <li>
              <strong>Category:</strong> {product.category}
            </li>
            <li>
              <strong>Sub Category:</strong> {product.subCategory}
            </li>
            <li>
              <strong>Visibility Level:</strong> {product.visibilityLevel}
            </li>
            <li>
              <strong>Delivery Preference:</strong> {product.deliveryPreference}
            </li>
            <li>
              <strong>Sale Type:</strong> {product.saleType}
            </li>
            <li>
              <strong>Description:</strong> {product.description}
            </li>
          </ul>
        </div>

        {product.images && product.images.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`data:${image.contentType};base64,${image.data}`}
                  alt={`Product ${index + 1}`}
                  className="rounded-lg shadow"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OgcsSellerDetailsPage;
