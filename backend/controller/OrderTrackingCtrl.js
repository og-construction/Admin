const OrderTracking = require("../models/OrderTrackingModel");
const asyncHandler = require("express-async-handler");
const sendEmail = require("./emailCtrl");
const userEmail = require("../models/userModel");

// Add a status update
const addStatusUpdate = asyncHandler(async (req, res) => {
  const { orderId, sellerId, status, dispatchDetails } = req.body;

  if (!orderId || !sellerId || !status) {
    return res
      .status(400)
      .json({ message: "Order ID, Seller ID, and Status are required." });
  }

  const validStatuses = [
    "Confirmed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  let tracking = await OrderTracking.findOne({ orderId, sellerId });
  if (!tracking) {
    tracking = new OrderTracking({ orderId, sellerId, statusUpdates: [] });
  }

  tracking.statusUpdates.push({ status, timestamp: new Date() });

  if (dispatchDetails) {
    tracking.dispatchDetails = {
      dispatchDate:
        dispatchDetails.dispatchDate || tracking.dispatchDetails.dispatchDate,
      expectedDeliveryDate:
        dispatchDetails.expectedDeliveryDate ||
        tracking.dispatchDetails.expectedDeliveryDate,
      referenceNumber:
        dispatchDetails.referenceNumber ||
        tracking.dispatchDetails.referenceNumber,
    };
  }

  await tracking.save();

  res.status(200).json({ message: "Status updated successfully.", tracking });
});
// Get tracking details for an order
const getTrackingDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const trackingDetails = await OrderTracking.find({ orderId }).populate(
    "sellerId",
    "name"
  );
  if (!trackingDetails || trackingDetails.length === 0) {
    return res
      .status(404)
      .json({ message: "No tracking details found for this order." });
  }

  res.status(200).json({ orderId, trackingDetails });
});
// Get all tracking records (Admin View)

const getAllTrackingRecords = asyncHandler(async (req, res) => {
  try {
    const trackingRecords = await OrderTracking.find(
      {},
      "-createdAt -updatedAt"
    ).populate({
      path: "statusUpdates.productId",
      populate: [
        { path: "image" }, // Populate `image` of `product`
        { path: "category", select: "name" }, // Populate `category` with only the `name` field
        { path: "subcategory", select: "name" }, // Populate `subcategory` with only the `name` field
      ],
    });

    res.status(200).json(trackingRecords);
  } catch (error) {
    console.error("Error fetching tracking records:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching tracking records." });
  }
});
const updateOrderTracking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, expectedDeliveryDate, reason } = req.body;

  const validTransitions = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Shipped", "Cancelled"],
    Shipped: ["Out for Delivery", "Delivered", "Cancelled"],
    OutForDelivery: ["Delivered", "Cancelled"],
    Delivered: [], // No updates allowed once delivered
  };

  const orderTracking = await OrderTracking.findById(id).populate({
    path: "orderId",
    populate: { path: "user", select: "email name" },
  });

  if (!orderTracking) {
    return res.status(404).json({ message: "Order tracking not found" });
  }

  const userEmail = orderTracking.orderId.user.email;
  const userName = orderTracking.orderId.user.name || "Customer";

  const updatedDeliveryDate =
    expectedDeliveryDate || orderTracking.dispatchDetails?.expectedDeliveryDate;
  let productId = orderTracking.statusUpdates[0].productId;

  const currentStatus =
    orderTracking.statusUpdates[orderTracking.statusUpdates.length - 1]
      ?.status || "Pending";

  // Check if the transition is valid
  if (!validTransitions[currentStatus]?.includes(status)) {
    return res.status(403).json({
      message: `Invalid status transition from '${currentStatus}' to '${status}'.`,
    });
  }

  // For Delivered status, trigger OTP generation and stop further updates
  if (status === "Delivered") {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    orderTracking.otp = generatedOtp;
    orderTracking.otpExpiresAt = Date.now() + 5 * 60 * 1000; // Valid for 5 minutes
    await orderTracking.save();

    // Send OTP to email
    await sendEmail({
      type: "otpverifyDelivery",
      to: userEmail,
      subject: "Order Delivery OTP Verification",
      otp: generatedOtp,
      name: userName,
    });

    return res
      .status(200)
      .json({ message: "OTP sent to the customer's email." });
  }

  // Construct the status update object
  const statusUpdate = {
    status,
    productId,
    timestamp: new Date(),
  };

  if (reason) {
    statusUpdate.reason = reason;
  }

  orderTracking.statusUpdates.push(statusUpdate);

  if (expectedDeliveryDate) {
    orderTracking.dispatchDetails.expectedDeliveryDate = updatedDeliveryDate;
  }

  await orderTracking.save();

  res.status(200).json({ message: "Order tracking updated successfully." });
});

const verifyOtpDelivery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { otp } = req.body;

  const orderTracking = await OrderTracking.findById(id);
  if (!orderTracking) {
    return res.status(404).json({ message: "Order tracking not found." });
  }
  let productId = orderTracking.statusUpdates[0].productId;

  if (otp !== orderTracking.otp) {
    return res.status(400).json({ message: "Invalid OTP." });
  }

  if (Date.now() > orderTracking.otpExpiresAt) {
    return res.status(400).json({ message: "OTP has expired." });
  }

  // Mark the order as Delivered
  orderTracking.statusUpdates.push({
    status: "Delivered",
    productId,
    timestamp: new Date(),
  });

  orderTracking.otp = undefined;
  orderTracking.otpExpiresAt = undefined;

  await orderTracking.save();

  res
    .status(200)
    .json({ message: "OTP verified successfully. Order marked as Delivered." });
});

module.exports = {
  addStatusUpdate,
  getTrackingDetails,
  getAllTrackingRecords,
  updateOrderTracking,
  verifyOtpDelivery,
};
