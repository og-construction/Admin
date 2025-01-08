import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SellerDetails = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/sellers/${id}`);
        setSeller(response.data);
      } catch (error) {
        console.error("Error fetching seller details:", error.message);
      }
    };

    fetchSellerDetails();
  }, [id]);

  if (!seller) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Seller Details</h2>
      <p><strong>Name:</strong> {seller.name}</p>
      <p><strong>Email:</strong> {seller.email}</p>
      <p><strong>Company Name:</strong> {seller.companyName}</p>
      <p><strong>Mobile:</strong> {seller.mobile}</p>
      <p><strong>Address:</strong> {`${seller.address?.street}, ${seller.address?.city}`}</p>
      <h3 className="text-lg font-semibold mt-4">Products</h3>
      {seller.products.length > 0 ? (
        <ul className="list-disc ml-6">
          {seller.products.map((product) => (
            <li key={product._id}>{product.name}</li>
          ))}
        </ul>
      ) : (
        <p>No products found for this seller.</p>
      )}
    </div>
  );
};

export default SellerDetails;
