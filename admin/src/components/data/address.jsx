import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url";

const AddressDataPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch address data from the API
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/admin/addresses`); // Adjust the API endpoint as needed
        setAddresses(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching addresses.");
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Addresses</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">User Name</th>
              <th className="px-4 py-2 border">User Email</th>
              <th className="px-4 py-2 border">Mobile Number</th>
              <th className="px-4 py-2 border">Postal Code</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">City/Town</th>
              <th className="px-4 py-2 border">State</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address) => (
              <tr key={address.id} className="text-center border-t">
                <td className="px-4 py-2 border">{address.id}</td>
                <td className="px-4 py-2 border">{address.userName}</td>
                <td className="px-4 py-2 border">{address.userEmail}</td>
                <td className="px-4 py-2 border">{address.mobileNumber}</td>
                <td className="px-4 py-2 border">{address.postalCode}</td>
                <td className="px-4 py-2 border">
                  {address.houseNumberOrApartment}, {address.areaOrStreet}, {address.landmark}
                </td>
                <td className="px-4 py-2 border">{address.cityOrTown}</td>
                <td className="px-4 py-2 border">{address.selectedState}</td>
                <td className="px-4 py-2 border">{new Date(address.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 border">{new Date(address.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddressDataPage;
