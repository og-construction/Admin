import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const DeliveryChargeDataPage = () => {
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [filteredCharges, setFilteredCharges] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch delivery charge data from the API
  useEffect(() => {
    const fetchDeliveryCharges = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/delivery-charges`);
        setDeliveryCharges(response.data || []);
        setFilteredCharges(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchDeliveryCharges();
  }, []);

  // Filter delivery charges based on the search input
  useEffect(() => {
    setFilteredCharges(
      deliveryCharges.filter(
        (charge) =>
          charge.id.toString().includes(search) ||
          (charge.sellerName && charge.sellerName.toLowerCase().includes(search.toLowerCase())) ||
          (charge.sellerEmail && charge.sellerEmail.toLowerCase().includes(search.toLowerCase())) ||
          (charge.productName && charge.productName.toLowerCase().includes(search.toLowerCase()))
      )
    );
  }, [search, deliveryCharges]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Delivery Charges</h1>

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search by ID, Seller Name, Email, or Product Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
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
            {filteredCharges.length > 0 ? (
              filteredCharges.map((charge) => (
                <tr key={charge.id} className="text-center hover:bg-gray-100">
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
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-4">
                  No delivery charges found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryChargeDataPage;
