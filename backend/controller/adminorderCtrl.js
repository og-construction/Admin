const OrderTracking = require("../models/OrderTrackingModel");
const asyncHandler = require("express-async-handler");



// Controller to get order summary by the latest status
const getOrderSummary = asyncHandler(async (req, res) => {
  try {
    // Aggregate the count of orders based on their latest status
    const summary = await OrderTracking.aggregate([
      {
        $project: {
          latestStatus: { $arrayElemAt: ["$statusUpdates", -1] }, // Get the last element from the statusUpdates array
        },
      },
      {
        $group: {
          _id: "$latestStatus.status", // Group by the latest status
          count: { $sum: 1 }, // Count each status occurrence
        },
      },
    ]);

    // Map results into a structured response
    const statusCounts = summary.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json({
      totalPendingOrder: statusCounts["Pending"] || 0,
      totalConfirmedOrder: statusCounts["Confirmed"] || 0,
      totalCanceledOrder: statusCounts["Canceled"] || 0,
      totalDeliveredOrder: statusCounts["Delivered"] || 0,
      totalShippedOrder: statusCounts["Shipped"] || 0,
    });
  } catch (error) {
    console.error("Error fetching order summary:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching the order summary.",
    });
  }
});



const getPendingOrders = asyncHandler(async (req, res) => {
    try {
      // Fetch orders where the latest status is "Pending"
      const pendingOrders = await OrderTracking.aggregate([
        {
          $addFields: {
            latestStatus: { $arrayElemAt: ["$statusUpdates", -1] }, // Add a field for the last status
          },
        },
        {
          $match: {
            "latestStatus.status": "Pending", // Filter only orders with latest status as "Pending"
          },
        },
      ]);
  
      // Populate `sellerId` and `userId` using a separate query
      const populatedOrders = await OrderTracking.populate(pendingOrders, [
        { path: "sellerId", select: "name email" },
        { path: "userId", select: "name email" },
      ]);
  
      // Format the response
      const formattedOrders = populatedOrders.map((order) => ({
        orderId: order.orderId,
        sellerName: order.sellerId?.name || "N/A",
        sellerEmail: order.sellerId?.email || "N/A",
        userName: order.userId?.name || "N/A",
        userEmail: order.userId?.email || "N/A",
        latestStatus: order.latestStatus,
        createdAt: order.createdAt,
      }));
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Error fetching pending orders:", error.message);
      res.status(500).json({
        error: "An error occurred while fetching pending orders.",
      });
    }
  });

 
const getConfirmedOrders = asyncHandler(async (req, res) => {
    try {
      // Fetch orders where the latest status is "Confirmed"
      const confirmedOrders = await OrderTracking.aggregate([
        {
          $addFields: {
            latestStatus: { $arrayElemAt: ["$statusUpdates", -1] }, // Extract the last status update
          },
        },
        {
          $match: {
            "latestStatus.status": "Confirmed", // Match only orders where the latest status is "Confirmed"
          },
        },
      ]);
  
      // Populate `sellerId` and `userId` fields
      const populatedOrders = await OrderTracking.populate(confirmedOrders, [
        { path: "sellerId", select: "name email" },
        { path: "userId", select: "name email" },
      ]);
  
      // Format the response with fallback values
      const formattedOrders = populatedOrders.map((order) => ({
        orderId: order.orderId,
        sellerName: order.sellerId?.name || "N/A",
        sellerEmail: order.sellerId?.email || "N/A",
        userName: order.userId?.name || "N/A",
        userEmail: order.userId?.email || "N/A",
        latestStatus: order.latestStatus,
        createdAt: order.createdAt,
      }));
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Error fetching confirmed orders:", error.message);
      res.status(500).json({
        error: "An error occurred while fetching confirmed orders.",
      });
    }
  });
  const getShippedOrders = asyncHandler(async (req, res) => {
    try {
      // Fetch orders where the latest status is "Shipped"
      const ShippedOrders = await OrderTracking.aggregate([
        {
          $addFields: {
            latestStatus: { $arrayElemAt: ["$statusUpdates", -1] }, // Add a field for the last status
          },
        },
        {
          $match: {
            "latestStatus.status": "Shipped", // Filter only orders with latest status as "Shipped"
          },
        },
      ]);
  
      // Populate `sellerId` and `userId` using a separate query
      const populatedOrders = await OrderTracking.populate(ShippedOrders, [
        { path: "sellerId", select: "name email" },
        { path: "userId", select: "name email" },
      ]);
  
      // Format the response
      const formattedOrders = populatedOrders.map((order) => ({
        orderId: order.orderId,
        sellerName: order.sellerId?.name || "N/A",
        sellerEmail: order.sellerId?.email || "N/A",
        userName: order.userId?.name || "N/A",
        userEmail: order.userId?.email || "N/A",
        latestStatus: order.latestStatus,
        createdAt: order.createdAt,
      }));
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Error fetching pending orders:", error.message);
      res.status(500).json({
        error: "An error occurred while fetching pending orders.",
      });
    }
  });


  const getDeliveredOrders = asyncHandler(async (req, res) => {
    try {
      // Fetch orders where the latest status is "Shipped"
      const DeliveredOrders = await OrderTracking.aggregate([
        {
          $addFields: {
            latestStatus: { $arrayElemAt: ["$statusUpdates", -1] }, // Add a field for the last status
          },
        },
        {
          $match: {
            "latestStatus.status": "Delivered", // Filter only orders with latest status as "Shipped"
          },
        },
      ]);
  
      // Populate `sellerId` and `userId` using a separate query
      const populatedOrders = await OrderTracking.populate(DeliveredOrders, [
        { path: "sellerId", select: "name email" },
        { path: "userId", select: "name email" },
      ]);
  
      // Format the response
      const formattedOrders = populatedOrders.map((order) => ({
        orderId: order.orderId,
        sellerName: order.sellerId?.name || "N/A",
        sellerEmail: order.sellerId?.email || "N/A",
        userName: order.userId?.name || "N/A",
        userEmail: order.userId?.email || "N/A",
        latestStatus: order.latestStatus,
        createdAt: order.createdAt,
      }));
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Error fetching pending orders:", error.message);
      res.status(500).json({
        error: "An error occurred while fetching pending orders.",
      });
    }
  });

  const getCancelledOrders = asyncHandler(async (req, res) => {
    try {
      // Fetch orders where the latest status is "Shipped"
      const CancelledOrders = await OrderTracking.aggregate([
        {
          $addFields: {
            latestStatus: { $arrayElemAt: ["$statusUpdates", -1] }, // Add a field for the last status
          },
        },
        {
          $match: {
            "latestStatus.status": "Cancelled", // Filter only orders with latest status as "Shipped"
          },
        },
      ]);
  
      // Populate `sellerId` and `userId` using a separate query
      const populatedOrders = await OrderTracking.populate(CancelledOrders, [
        { path: "sellerId", select: "name email" },
        { path: "userId", select: "name email" },
      ]);
  
      // Format the response
      const formattedOrders = populatedOrders.map((order) => ({
        orderId: order.orderId,
        sellerName: order.sellerId?.name || "N/A",
        sellerEmail: order.sellerId?.email || "N/A",
        userName: order.userId?.name || "N/A",
        userEmail: order.userId?.email || "N/A",
        latestStatus: order.latestStatus,
        createdAt: order.createdAt,
      }));
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Error fetching pending orders:", error.message);
      res.status(500).json({
        error: "An error occurred while fetching pending orders.",
      });
    }
  });
module.exports = {
  getOrderSummary,
  getPendingOrders,
  getConfirmedOrders,
  getCancelledOrders,
  getDeliveredOrders,
  getShippedOrders

};
