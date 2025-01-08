import React, { useState, useEffect } from "react";
import axios from "axios";

const ApproveProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchPendingProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/products/pending");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching pending products:", error.message);
      }
    };

    fetchPendingProducts();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/products/${id}/approve`);
      setProducts(products.filter((product) => product._id !== id));
      alert("Product approved successfully!");
    } catch (error) {
      console.error("Error approving product:", error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Approve Products</h2>
      {products.length > 0 ? (
        <ul className="list-disc ml-6">
          {products.map((product) => (
            <li key={product._id}>
              {product.name} - {product.description}
              <button
                onClick={() => handleApprove(product._id)}
                className="bg-green-500 text-white px-2 py-1 rounded ml-4"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products pending approval.</p>
      )}
    </div>
  );
};

export default ApproveProducts;
