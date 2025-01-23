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
      if (!token) {
        console.error("Token is missing!");alert("Session expired. Redirecting to login.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        setIsLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const [
          ordersResponse,
          orderSummaryResponse,
          usersResponse,
          interestedUsersResponse,
          productResponse,
          sellerMetricsResponse,
          earningsResponse,
        ] = await Promise.all([
          axios.get(`${baseurl}/api/admin/orders`, config),
          axios.get(`${baseurl}/api/admin/order-summary`, config),
          axios.get(`${baseurl}/api/admin/user/all-users`, config),
          axios.get(`${baseurl}/api/admin/interested-users`, config),
          axios.get(`${baseurl}/api/product`),
          axios.get(`${baseurl}/api/admin/seller-metrics`, config),
          axios.get(`${baseurl}/api/admin/earnings`, config),
        ]);
  
        setDashboardData((prev) => ({
          ...prev,
          totalOrders: ordersResponse.data?.totalOrders || 0,
          todaysOrders: ordersResponse.data?.todaysOrders || 0,
          totalAmount: ordersResponse.data?.totalAmount || 0,
          todayTotalAmount: ordersResponse.data?.todayTotalAmount || 0,
          totalPendingOrder: orderSummaryResponse.data?.totalPendingOrder || 0,
          totalConfirmedOrder: orderSummaryResponse.data?.totalConfirmedOrder || 0,
          totalCanceledOrder: orderSummaryResponse.data?.totalCanceledOrder || 0,
          totalDeliveredOrder: orderSummaryResponse.data?.totalDeliveredOrder || 0,
          totalUsers: usersResponse.data?.totalUsers || 0,
          interestedUsers: interestedUsersResponse.data?.totalInterestedUsers || 0,
          totalProduct: productResponse.data?.totalProducts || 0,
        }));
  
        setSellerMetrics(sellerMetricsResponse.data);
        setSellerEarnings(earningsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Redirecting to login.");
          localStorage.removeItem("token");
          // window.location.href = "/login";
        }
      } finally {
        setIsLoading(false);
      }
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
          dashboardData.totalUsers || 0,
          dashboardData.totalOrders || 0,
          dashboardData.interestedUsers || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const sellerGraphData = sellerMetrics
    ? {
        labels: ["Total Sellers", "Products by Sellers", "Products by OGCS"],
        datasets: [
          {
            label: "Seller Metrics",
            data: [
              sellerMetrics.totalSellers || 0,
              sellerMetrics.totalProductsBySellers || 0,
              sellerMetrics.totalProductsByOGCS || 0,
            ],
            backgroundColor: ["#4BC0C0", "#FF9F40", "#9966FF"],
          },
        ],
      }
    : null;

  const earningsGraphData = sellerEarnings
    ? {
        labels: ["Visibility Amount", "Power Pack Amount", "Deposit Amount", "Registration Amount"],
        datasets: [
          {
            label: "Earnings (₹)",
            data: [
              sellerEarnings.visibilityAmount || 0,
              sellerEarnings.powerPackAmount || 0,
              sellerEarnings.depositAmount || 0,
              sellerEarnings.registrationAmount || 0,
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
          {[
            {
              icon: <ShoppingCart />,
              value: dashboardData.todaysOrders,
              label: "Today's Orders",
            },
            {
              icon: <ShoppingCart />,
              value: dashboardData.totalOrders,
              label: "Total Orders",
            },
            {
              icon: <AttachMoney />,
              value: dashboardData.todayTotalAmount.toFixed(2),
              label: "Today's Earnings",
            },
            {
              icon: <AttachMoney />,
              value: dashboardData.totalAmount.toFixed(2),
              label: "Total Earnings",
            },
            {
              icon: <HourglassEmpty />,
              value: dashboardData.totalPendingOrder,
              label: "Pending Orders",
            },
            {
              icon: <CheckCircle />,
              value: dashboardData.totalConfirmedOrder,
              label: "Confirmed Orders",
            },
            {
              icon: <Cancel />,
              value: dashboardData.totalCanceledOrder,
              label: "Canceled Orders",
            },
            {
              icon: <Assessment />,
              value: dashboardData.totalDeliveredOrder,
              label: "Delivered Orders",
            },
            {
              icon: <Group />,
              value: dashboardData.totalUsers,
              label: "Total Users",
            },
            {
              icon: <ShoppingCart />,
              value: dashboardData.totalProduct,
              label: "Total Products",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white shadow rounded-lg text-center border border-gray-200"
            >
              <div className="flex justify-center text-blue-600 mb-3">{item.icon}</div>
              <h2 className="text-2xl font-bold text-blue-600">{item.value}</h2>
              <p className="text-gray-500 mt-2">{item.label}</p>
            </div>
          ))}
        </div>
  
        {/* Graph Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-center">User Metrics</h2>
            <Graph data={graphData} type="Doughnut" title="User Metrics" />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-center">Seller Metrics</h2>
            <Graph data={sellerGraphData} type="Doughnut" title="Seller Metrics" />
          </div>
        </div>
        {earningsGraphData && (
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold mb-4 text-center">Earnings Overview</h2>
            <Graph data={earningsGraphData} type="Line" title="Earnings Breakdown" />
          </div>
        )}
      </div>
    );
  };
  
  export default Dashboard;
  