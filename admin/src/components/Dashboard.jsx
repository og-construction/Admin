import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingCart,
  AttachMoney,
  HourglassEmpty,
  Cancel,
  CheckCircle,
  Assessment,
  Group,
} from "@mui/icons-material";
import { baseurl } from "./config/url";
import Graph from "../components/admin/graph";

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
    interestedUsers: 0,
    totalUsers: 0,
  });
  const [sellerMetrics, setSellerMetrics] = useState({
    totalSellers: 0,
    totalProductsBySellers: 0,
    totalProductsByOGCS: 0,
});
  const [isLoading, setIsLoading] = useState(true);
  const [sellerEarnings, setSellerEarnings] = useState(null); // Seller earnings state

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      const token = localStorage.getItem("token"); // Retrieve token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      };

      // Define separate API calls
      const fetchOrders = axios.get(`${baseurl}/api/admin/orders`, config);
      const fetchOrderSummary = axios.get(
        `${baseurl}/api/admin/order-summary`,
        config
      );
      const fetchUsers = axios.get(`${baseurl}/api/admin/user/all-users`, config);
      const fetchInterestedUsers = axios.get(
        `${baseurl}/api/admin/interested-users`,
        config
      );

      // Execute API calls
      try {
        // Orders API
        const ordersResponse = await fetchOrders;
        setDashboardData((prevData) => ({
          ...prevData,
          totalOrders: ordersResponse.data.totalOrders || 0,
          todaysOrders: ordersResponse.data.todaysOrders || 0,
          totalAmount: ordersResponse.data.totalAmount || 0,
          todayTotalAmount: ordersResponse.data.todayTotalAmount || 0,
        }));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }

      try {
        // Order Summary API
        const orderSummaryResponse = await fetchOrderSummary;
        setDashboardData((prevData) => ({
          ...prevData,
          totalPendingOrder: orderSummaryResponse.data.totalPendingOrder || 0,
          totalConfirmedOrder: orderSummaryResponse.data.totalConfirmedOrder || 0,
          totalCanceledOrder: orderSummaryResponse.data.totalCanceledOrder || 0,
          totalDeliveredOrder: orderSummaryResponse.data.totalDeliveredOrder || 0,
        }));
      } catch (error) {
        console.error("Error fetching order summary:", error);
      }
    
      try {
        // Users API
        const usersResponse = await fetchUsers;
        setDashboardData((prevData) => ({
          ...prevData,
          totalUsers: usersResponse.data.totalUsers || 0,
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
      }

      try {
        // Interested Users API
        const interestedUsersResponse = await fetchInterestedUsers;
        setDashboardData((prevData) => ({
          ...prevData,
          interestedUsers: interestedUsersResponse.data.totalInterestedUsers || 0,
        }));
        
      } catch (error) {
        console.error("Error fetching interested users:", error);
      }

      try{
          // Fetch Seller Metrics
          const sellerMetricsResponse = await axios.get(`${baseurl}/api/admin/seller-metrics`, config);
          setSellerMetrics(sellerMetricsResponse.data);

        const earningsResponse = await axios.get(`${baseurl}/api/admin/earnings`, config);
        setSellerEarnings(earningsResponse.data);
      }
     catch (error) {
      console.error("Error fetching seller data:", error);
  }


      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  console.log("Dashboard Data:", dashboardData);

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
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const sellerGraphData = {
    labels: ["Total Sellers", "Products by Sellers", "Products by OGCS"],
    datasets: [
      {
        label: "Seller Metrics",
        data: [
          sellerMetrics.totalSellers,
          sellerMetrics.totalProductsBySellers,
          sellerMetrics.totalProductsByOGCS,
        ],
        backgroundColor: ["#4BC0C0", "#FF9F40", "#9966FF"],
      },
    ],
  };
  
  const earningsGraphData = sellerEarnings
    ? {
        labels: ["Visibility Amount", "Power Pack Amount", "Deposit Amount", "Registration Amount"],
        datasets: [
          {
            label: "Earnings (₹)",
            data: [
              sellerEarnings.visibilityAmount,
              sellerEarnings.powerPackAmount,
              sellerEarnings.depositAmount,
              sellerEarnings.registrationAmount,
            ],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          },
        ],
      }
      : null;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Dashboard Cards */}
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

        {/* Other cards */}
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-center">User Metrics</h2>
          <div style={{ height: '350px', width: '100%', margin: '0 auto' }}>
            <Graph data={graphData} type="Doughnut" title="Doughnut Chart: User Metrics" />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Seller Metrics</h2>
          <div style={{ height: '350px', width: '100%', margin: '0 auto' }}>
            <Graph data={sellerGraphData} type="Doughnut" title="Doughnut Chart: Seller Metrics" />
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 col-span-2">
  <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
    Seller Earnings Overview
  </h2>
  <div
    className="relative bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-lg"
    style={{ height: "400px", width: "100%" }}
  >
    <Graph
      data={earningsGraphData}
      type="Line"
      title="Earnings Breakdown (₹)"
    />
    <p className="absolute bottom-4 right-4 text-sm text-gray-600 italic">
      * Data represents earnings breakdown over time
    </p>
  </div>
</div>




    </div>
  );
};

export default Dashboard;
