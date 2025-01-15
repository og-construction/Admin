import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const DeliveryChargeDataPage = () => {
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch delivery charge data from the API
  useEffect(() => {
    const fetchDeliveryCharges = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/delivery-charges`);
        setDeliveryCharges(response.data || []); // Default to empty array if no data
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchDeliveryCharges();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Delivery Charges</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Seller Name</th>
              <th className="px-4 py-2 border">Seller Email</th>
              <th className="px-4 py-2 border">Product Name</th>
              <th className="px-4 py-2 border">Base Charge</th>
              <th className="px-4 py-2 border">Per KM Charge</th>
              <th className="px-4 py-2 border">Weight Charge</th>
              <th className="px-4 py-2 border">Max Distance</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {deliveryCharges.map((charge) => (
              <tr key={charge.id} className="text-center border-t">
                <td className="px-4 py-2 border">{charge.id}</td>
                <td className="px-4 py-2 border">{charge.sellerName}</td>
                <td className="px-4 py-2 border">{charge.sellerEmail}</td>
                <td className="px-4 py-2 border">{charge.productName || "N/A"}</td>
                <td className="px-4 py-2 border">₹{charge.baseCharge}</td>
                <td className="px-4 py-2 border">₹{charge.perKmCharge}</td>
                <td className="px-4 py-2 border">₹{charge.weightCharge}</td>
                <td className="px-4 py-2 border">{charge.maxDistance} km</td>
                <td className="px-4 py-2 border">
                  {new Date(charge.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(charge.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryChargeDataPage;
