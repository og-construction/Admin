import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseurl } from "../../config/url";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`${baseurl}/api/seller/product-details/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(data); // Debugging: Check product structure
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600 animate-pulse">
          Loading product details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 lg:px-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">{product.name}</h1>
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-4">
        <p className="text-lg text-gray-700">
          <strong>Description:</strong> {product.description || "N/A"}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Price:</strong> {product.price} ({product.priceUnit})
        </p>
        <p className="text-lg text-gray-700">
          <strong>Stock:</strong> {product.stock}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Category:</strong> {product.category?.name || product.category || "N/A"}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Subcategory:</strong> {product.subcategory?.name || product.subcategory || "N/A"}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Size:</strong> {product.size || "N/A"}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Sold:</strong> {product.sold}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Min Quantity:</strong> {product.minquantity || "N/A"}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Max Quantity:</strong> {product.maxquantity || "N/A"}
        </p>
        <p className="text-lg text-gray-700">
          <strong>HSN Code:</strong> {product.hsnCode || "N/A"}
        </p>
        <p className="text-lg text-gray-700">
          <strong>GST Number:</strong> {product.gstNumber || "N/A"}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Visibility Level:</strong> {product.visibilityLevel || "N/A"}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Delivery Preference:</strong>{" "}
          {product.deliveryPreference
            ? `${product.deliveryPreference.duration} ${product.deliveryPreference.unit}`
            : "N/A"}
        </p>
        <p className="text-lg text-gray-700">
          <strong>PowerPack Visibility:</strong>{" "}
          {product.PowerPackVisibility ? "Yes" : "No"}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Sale Type:</strong> {product.saleType || "N/A"}
        </p>
        <div className="text-lg text-gray-700">
          <strong>Specifications:</strong>
          <ul className="list-disc pl-5">
            {product.specifications?.length > 0
              ? product.specifications.map((spec, index) => (
                  <li key={index}>
                    {spec.key}: {spec.value}
                  </li>
                ))
              : "N/A"}
          </ul>
        </div>
        <div className="text-lg text-gray-700">
          <strong>Images:</strong>
          <ul className="list-disc pl-5">
            {product.images?.length > 0
              ? product.images.map((image, index) => (
                  <li key={index}>{image.$oid}</li>
                ))
              : "N/A"}
          </ul>
        </div>
        <p className="text-lg text-gray-700">
  <strong>Seller:</strong>{" "}
  {product.seller
    ? `${product.seller.name} (${product.seller.email})`
    : "N/A"}
</p>

        <p className="text-lg text-gray-700">
          <strong>Approved:</strong> {product.approved ? "Yes" : "No"}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Visibility Payment:</strong>{" "}
          {product.visibilityPayment ? "Yes" : "No"}
        </p>
        <div className="text-lg text-gray-700">
  <strong>Images:</strong>
  <div className="grid grid-cols-2 gap-4">
    {product.images?.length > 0 ? (
      product.images.map((image, index) => (
        <div key={index} className="w-full max-w-sm">
          {image.data ? (
            <img
              src={`data:${image.contentType};base64,${image.data}`}
              alt={image.filename || `Image ${index + 1}`}
              className="w-full rounded-lg shadow-md"
            />
          ) : (
            <p className="text-gray-500">Image data not available</p>
          )}
        </div>
      ))
    ) : (
      <p className="text-gray-500">No images available</p>
    )}
  </div>
</div>

      </div>
    </div>
  );
};

export default ProductDetails;
