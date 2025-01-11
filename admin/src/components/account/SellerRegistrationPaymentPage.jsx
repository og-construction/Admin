import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../config/url"

const SellerRegistrationPaymentsPage = () => {
  const [sellerPayments, setSellerPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerPayments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/admin/registration/payment/:sellerId`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored in localStorage
          },
        });
        setSellerPayments(response.data.paymentDetails);
      } catch (err) {
        console.error("Error fetching seller payments:", err);
        setError(err.response?.data?.message || "Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerPayments();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-10">
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-8">
        Seller Registration Payments
      </h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : sellerPayments.length === 0 ? (
        <div className="text-center text-gray-500">No payments found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2">Payment ID</th>
                <th className="px-4 py-2">Seller Name</th>
                <th className="px-4 py-2">Order Creation ID</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Payment Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sellerPayments.map((payment, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-4 py-2 text-center">{payment.id}</td>
                  <td className="px-4 py-2 text-center">
                    {payment.sellerName || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {payment.orderCreationId || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">₹{payment.amount}</td>
                  <td className="px-4 py-2 text-center">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {payment.paymentStatus || "Completed"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerRegistrationPaymentsPage;
