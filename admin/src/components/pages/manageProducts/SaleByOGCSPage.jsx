import React from "react";
import { useNavigate } from "react-router-dom";

const SaleByOGCSPage = () => {
  const navigate = useNavigate();

  // Example data for OGCS sales (you can replace this with API data)
  const ogcsSales = [
    {
      id: 1,
      productName: "Cement",
      price: "400",
      stock: 100,
      visibilityLevel: "4X",
      deliveryTime: "7 days",
      saleType: "Online",
    },
    {
      id: 2,
      productName: "Steel Rods",
      price: "50",
      stock: 500,
      visibilityLevel: "3X",
      deliveryTime: "5 days",
      saleType: "COD",
    },
  ];

  // Handle navigation to details page
  const handleActionClick = (productId) => {
    navigate(`/ogcs-product-details/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-green-500 text-center mb-8">
        Sale By OGCS Page
      </h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="table-auto w-full text-left border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-2 border border-gray-300">Product Name</th>
              <th className="p-2 border border-gray-300">Price</th>
              <th className="p-2 border border-gray-300">Stock</th>
              <th className="p-2 border border-gray-300">Visibility Level</th>
              <th className="p-2 border border-gray-300">Delivery Time</th>
              <th className="p-2 border border-gray-300">Sale Type</th>
              <th className="p-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {ogcsSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-100">
                <td className="p-2 border border-gray-300">{sale.productName}</td>
                <td className="p-2 border border-gray-300">{sale.price}</td>
                <td className="p-2 border border-gray-300">{sale.stock}</td>
                <td className="p-2 border border-gray-300">{sale.visibilityLevel}</td>
                <td className="p-2 border border-gray-300">{sale.deliveryTime}</td>
                <td className="p-2 border border-gray-300">{sale.saleType}</td>
                <td className="p-2 border border-gray-300">
                  <button
                    onClick={() => handleActionClick(sale.id)}
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

export default SaleByOGCSPage;
