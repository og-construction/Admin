import React from "react";
import { useNavigate } from "react-router-dom";

const SaleBySellerPage = () => {
  const navigate = useNavigate();

  // Example data for sellers (you can replace this with data fetched from an API)
  const sellers = [
    {
      id: 1,
      sellerName: "Sanika Kashid",
      productName: "Product A",
      price: "100",
      stock: 50,
      visibilityLevel: "3X",
      maxQuantity:"40",
      paymentMode: "Online",
    },
    {
      id: 2,
      sellerName: "Akash Pawar",
      productName: "Product B",
      price: "200",
      stock: 30,
      visibilityLevel: "1X",
      maxQuantity:"30",
      paymentMode: "COD",
    },
  ];

  // Handle action click to navigate to another page
  const handleActionClick = (sellerId) => {
    navigate(`/seller-details/${sellerId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-green-500 text-center mb-8">
        Sale By Seller Page
      </h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="table-auto w-full text-left border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-2 border border-gray-300">Seller Name</th>
              <th className="p-2 border border-gray-300">Product Name</th>
              <th className="p-2 border border-gray-300">Price</th>
              <th className="p-2 border border-gray-300">Stock</th>
              <th className="p-2 border border-gray-300">Visibility Level</th>
              <th className="p-2 border border-gray-300">Max Quantity</th>
              <th className="p-2 border border-gray-300">Payment Mode</th>
              <th className="p-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-gray-100">
                <td className="p-2 border border-gray-300">{seller.sellerName}</td>
                <td className="p-2 border border-gray-300">{seller.productName}</td>
                <td className="p-2 border border-gray-300">{seller.price}</td>
                <td className="p-2 border border-gray-300">{seller.stock}</td>
                <td className="p-2 border border-gray-300">
                  {seller.visibilityLevel}
                </td>
                <td className="p-2 border border-gray-300">{seller.maxQuantity}</td>
                <td className="p-2 border border-gray-300">{seller.paymentMode}</td>
                <td className="p-2 border border-gray-300">
                  <button
                    onClick={() => handleActionClick(seller.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Action
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaleBySellerPage;
