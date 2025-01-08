import React, { useState } from "react";
import {
  ShoppingCart,
  HourglassEmpty,
  Cancel,
  CheckCircle,
  AttachMoney,
  BarChart,
  Assessment,
  People,
  Star,
  Category,
  Notes,
} from "@mui/icons-material";

const Dashboard = () => {
  // Static data for the dashboard stats
  const [stats] = useState({
    todayOrder: 10,
    todayPendingOrder: 5,
    totalOrder: 150,
    totalPendingOrder: 20,
    totalCancelledOrder: 2,
    totalDeliveredOrder: 128,
    todayEarning: 3000,
    thisMonthEarning: 60000,
    thisYearEarning: 720000,
    totalEarning: 1000000,
    todayProductSale: 15,
    thisMonthProductSale: 300,
    thisYearProductSale: 3500,
    totalProductSale: 5000,
    totalProduct: 200,
    totalProductReview: 50,
    totalSeller: 30,
    totalUser: 500,
    totalBrand: 25,
    productCategory: 20,
    totalBlog: 10,
  });

  console.log("Dashboard Stats:", stats); // Debugging: Log stats to console

  const iconsMap = {
    todayOrder: <ShoppingCart />,
    todayPendingOrder: <HourglassEmpty />,
    totalOrder: <ShoppingCart />,
    totalPendingOrder: <HourglassEmpty />,
    totalCancelledOrder: <Cancel />,
    totalDeliveredOrder: <CheckCircle />,
    todayEarning: <AttachMoney />,
    thisMonthEarning: <AttachMoney />,
    thisYearEarning: <AttachMoney />,
    totalEarning: <BarChart />,
    todayProductSale: <Assessment />,
    thisMonthProductSale: <Assessment />,
    thisYearProductSale: <Assessment />,
    totalProductSale: <Assessment />,
    totalProduct: <Assessment />,
    totalProductReview: <Star />,
    totalSeller: <People />,
    totalUser: <People />,
    totalBrand: <Category />,
    productCategory: <Category />,
    totalBlog: <Notes />,
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {Object.entries(stats).map(([key, value], index) => (
          <div
            key={index}
            className="p-4 bg-white shadow rounded-lg text-center border border-gray-200"
          >
            <div className="flex justify-center text-blue-600 mb-3">
              {iconsMap[key]}
            </div>
            <h2 className="text-2xl font-bold text-blue-600">{value || 0}</h2>
            <p className="text-gray-500 mt-2 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </p>
          </div>
        ))}
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Today New Orders</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 p-2">SN</th>
              <th className="border border-gray-200 p-2">Customer</th>
              <th className="border border-gray-200 p-2">Order ID</th>
              <th className="border border-gray-200 p-2">Date</th>
              <th className="border border-gray-200 p-2">Quantity</th>
              <th className="border border-gray-200 p-2">Amount</th>
              <th className="border border-gray-200 p-2">Order Status</th>
              <th className="border border-gray-200 p-2">Payment</th>
              <th className="border border-gray-200 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 p-2">1</td>
              <td className="border border-gray-200 p-2">John Doe</td>
              <td className="border border-gray-200 p-2">#12345</td>
              <td className="border border-gray-200 p-2">2025-01-06</td>
              <td className="border border-gray-200 p-2">3</td>
              <td className="border border-gray-200 p-2">$150</td>
              <td className="border border-gray-200 p-2">Pending</td>
              <td className="border border-gray-200 p-2">Unpaid</td>
              <td className="border border-gray-200 p-2 text-blue-500">View</td>
            </tr>
            <tr>
              <td
                colSpan="9"
                className="text-center border border-gray-200 p-4 text-gray-500"
              >
                No more data available in the table
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
