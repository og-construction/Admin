import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulated fetch function
  useEffect(() => {
    // Mock API data for products
    const products = [
      {
        id: 1,
        name: "CEMENT",
        price: "400 Per Number",
        stock: "352 Units",
        category: "Hand Tools",
        subCategory: "Manual Hand Tool",
        deliveryPreference: "30 days",
        seller: {
          name: "Akash Pawar",
          email: "akashpawarkali@gmail.com",
          mobile: "9686875595",
        },
        image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Ambuja_cement.jpg",
        paymentDate: "04 Jan 2025",
      },
      {
        id: 2,
        name: "Hammer",
        price: "500 Per Number",
        stock: "120 Units",
        category: "Hand Tools",
        subCategory: "Manual Hand Tool",
        deliveryPreference: "15 days",
        seller: {
          name: "John Doe",
          email: "john.doe@example.com",
          mobile: "9876543210",
        },
        image: "https://upload.wikimedia.org/wikipedia/commons/6/62/Hammer.jpg",
        paymentDate: "03 Jan 2025",
      },
    ];

    // Find the product by ID
      // Simulate an API call
      setTimeout(() => {
        const product = products.find((p) => p.id === parseInt(id));
        setProduct(product);
        setLoading(false);
      }, 1000); // Simulated delay
    }, [id]);
  
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-100 p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Details</h1>
          <p className="text-lg text-blue-500">Loading...</p>
        </div>
      );
    }
  
    if (!product) {
      return (
        <div className="min-h-screen bg-gray-100 p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Details</h1>
          <p className="text-lg text-red-500">Product not found.</p>
        </div>
      );
    }
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* seller Details Section */}
        <div className="bg-green-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-green-700 mb-2">Seller Details</h2>
          <p><strong>Seller Name:</strong> {product.seller.name || "N/A"}</p>
          <p><strong>Email:</strong> {product.seller.email || "N/A"}</p>
          <p><strong>Mobile:</strong> {product.seller.mobile || "N/A"}</p>
          <p><strong>Payment Date:</strong> {product.paymentDate || "N/A"}</p>
        </div>

        {/* Product Details Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Product Information</h2>
          <p><strong>Product Name:</strong> {product.name}</p>
          <p><strong>Price:</strong> {product.price}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Sub Category:</strong> {product.subCategory}</p>
          <p><strong>Delivery Preference:</strong> {product.deliveryPreference}</p>
          <p><strong>Sale Mode:</strong> {product.saleMode}</p>
        </div>

        {/* Product Image */}
        {/* <div className="col-span-1 lg:col-span-2 flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-80 h-80 object-contain rounded-lg shadow-md"
          />
        </div> */}
      </div>
    </div>
  );
};

export default ProductDetails;
