import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingCart,
  AttachMoney,
  HourglassEmpty,
  Cancel,
  CheckCircle,
  Assessment,
  Group
} from "@mui/icons-material";
import { baseurl } from "./config/url";
import Graph from '../components/admin/graph'
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    todaysOrders: 0,
    totalAmount: 0,
    todayTotalAmount: 0,
    totalPendingOrder: 0,
    totalConfirmedOrder: 0,
    totalCanceledOrder: 0,
    totalDeliveredOrder: 0,
    interestedUsers: 0, // Add interestedUsers

        totalUsers: 0, // Added totalUsers

  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {


        const token = localStorage.getItem("token"); // Retrieve token
const config = {
  headers: {
    Authorization: `Bearer ${token}`, // Include token in headers
  },
};

        const ordersResponse = await axios.get(`${baseurl}/api/admin/orders`);
        const orderSummaryResponse = await axios.get(
          `${baseurl}/api/admin/order-summary`
        );
        const usersResponse = await axios.get(`${baseurl}/api/admin/user/all-users`);
        const interestedUsersResponse = await axios.get(
          `${baseurl}/api/admin/interested-users`,
          config // Pass config with token
        );
        


        setDashboardData((prevData) => ({
          ...prevData,
          totalOrders: ordersResponse.data.totalOrders,
          todaysOrders: ordersResponse.data.todaysOrders,
          totalAmount: ordersResponse.data.totalAmount,
          todayTotalAmount: ordersResponse.data.todayTotalAmount,
          totalPendingOrder: orderSummaryResponse.data.totalPendingOrder,
          totalConfirmedOrder: orderSummaryResponse.data.totalConfirmedOrder,
          totalCanceledOrder: orderSummaryResponse.data.totalCanceledOrder,
          totalDeliveredOrder: orderSummaryResponse.data.totalDeliveredOrder,
          totalUsers: usersResponse.data.totalUsers, // Update totalUsers
          interestedUsers: interestedUsersResponse.data.totalInterestedUsers, // Update interestedUsers

        }));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }
  console.log('dasboard data',dashboardData)

  // Data for the graph
  const graphData = {
    labels: ["Total Users", "Total Orders", "Interested Users"],
    datasets: [
      {
        label: "Counts",
        data: [
          dashboardData.totalUsers,
          dashboardData.totalOrders,
          dashboardData.interestedUsers,
        ],
        backgroundColor: ["blue", "orange", "green"],
      },
    ],
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
          <div className="flex justify-center text-blue-600 mb-3">
            <ShoppingCart />
          </div>
          <h2 className="text-2xl font-bold text-blue-600">
            {dashboardData.todaysOrders}
          </h2>
          <p className="text-gray-500 mt-2">Today's Orders</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
          <div className="flex justify-center text-blue-600 mb-3">
            <ShoppingCart />
          </div>
          <h2 className="text-2xl font-bold text-blue-600">
            {dashboardData.totalOrders}
          </h2>
          <p className="text-gray-500 mt-2">Total Orders</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
          <div className="flex justify-center text-blue-600 mb-3">
            <AttachMoney />
          </div>
          <h2 className="text-2xl font-bold text-blue-600">
            {dashboardData.todayTotalAmount.toFixed(2)}
          </h2>
          <p className="text-gray-500 mt-2">Today's Earnings</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
          <div className="flex justify-center text-blue-600 mb-3">
            <AttachMoney />
          </div>
          <h2 className="text-2xl font-bold text-blue-600">
            {dashboardData.totalAmount.toFixed(2)}
          </h2>
          <p className="text-gray-500 mt-2">Total Earnings</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
          <div className="flex justify-center text-blue-600 mb-3">
            <HourglassEmpty />
          </div>
          <h2 className="text-2xl font-bold text-blue-600">
            {dashboardData.totalPendingOrder}
          </h2>
          <p className="text-gray-500 mt-2">Pending Orders</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
          <div className="flex justify-center text-blue-600 mb-3">
            <CheckCircle />
          </div>
          <h2 className="text-2xl font-bold text-blue-600">
            {dashboardData.totalConfirmedOrder}
          </h2>
          <p className="text-gray-500 mt-2">Confirmed Orders</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
          <div className="flex justify-center text-blue-600 mb-3">
            <Cancel />
          </div>
          <h2 className="text-2xl font-bold text-blue-600">
            {dashboardData.totalCanceledOrder}
          </h2>
          <p className="text-gray-500 mt-2">Canceled Orders</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
          <div className="flex justify-center text-blue-600 mb-3">
            <Assessment />
          </div>
          <h2 className="text-2xl font-bold text-blue-600">
            {dashboardData.totalDeliveredOrder}
          </h2>
          <p className="text-gray-500 mt-2">Delivered Orders</p>
        </div>
  {/* Total Users */}
  <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
          <div className="flex justify-center text-blue-600 mb-3">
            <Group />
          </div>
          <h2 className="text-2xl font-bold text-blue-600">
            {dashboardData.totalUsers}
          </h2>
          <p className="text-gray-500 mt-2">Total Users</p>
        </div>

      </div>

      {/* Graph Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Analytics</h2>
        <Graph data={graphData} />
      </div>
    </div>
  );
};

export default Dashboard;
