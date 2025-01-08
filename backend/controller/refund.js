const Refund = require("../models/refund");
const Order = require("../models/OrderModel");
const OrderTracking = require("../models/OrderTrackingModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Sale = require("../models/SaleSchema");

// Create Refund Request
const createRefund = async (req, res) => {
  try {
    const { orderTrackingId, type, reason } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderTrackingId)) {
      return res.status(400).json({ message: "Invalid order tracking ID" });
    }

    // Find the order tracking entry
    const tracking = await OrderTracking.findById(orderTrackingId)
      .populate("orderId")
      .populate("sellerId");

    if (!tracking) {
      return res.status(404).json({ message: "Order tracking not found" });
    }

    const order = tracking.orderId;

    if (!order || !order.items || order.items.length === 0) {
      return res.status(400).json({ message: "No items found in the order" });
    }

    // Match the tracking entry to an item in order.items using productId
    const trackingItem = order.items.find(
      (item) =>
        item.product.toString() ===
        tracking.statusUpdates[0].productId.toString()
    );

    if (!trackingItem) {
      return res
        .status(400)
        .json({ message: "No item found for the given tracking ID" });
    }

    const subtotalWithGST = trackingItem.subtotalwithgst || 0;
    const latestStatus =
      tracking.statusUpdates[tracking.statusUpdates.length - 1]?.status;

    if (!latestStatus) {
      return res
        .status(400)
        .json({ message: "No status updates available for this tracking ID" });
    }

    let refundAmount;

    // Check refund eligibility and calculate refund amount
    switch (latestStatus) {
      case "Pending":
        if (type !== "Cancellation Before Confirmation") {
          return res
            .status(400)
            .json({ message: "Invalid refund type for pending orders" });
        }
        refundAmount = subtotalWithGST; // Full refund
        break;

      case "Confirmed":
        if (type !== "Cancellation After Confirmation") {
          return res
            .status(400)
            .json({ message: "Invalid refund type for confirmed orders" });
        }
        refundAmount = Math.max(0, subtotalWithGST - order.deliveryCharges);
        break;

      case "Shipped":
        if (type !== "Cancellation After Order Shipped") {
          return res
            .status(400)
            .json({ message: "Invalid refund type for shipped orders" });
        }
        refundAmount = Math.max(0, subtotalWithGST - 2 * order.deliveryCharges);
        break;

      case "Delivered": {
        const deliveredUpdate = tracking.statusUpdates.find(
          (update) => update.status === "Delivered"
        );

        if (!deliveredUpdate) {
          return res.status(400).json({ message: "Order not delivered yet" });
        }

        const rejectionAllowed =
          new Date() - new Date(deliveredUpdate.timestamp) <=
          3 * 24 * 60 * 60 * 1000;

        if (!rejectionAllowed) {
          return res.status(400).json({ message: "Rejection period expired" });
        }

        if (type !== "Material Rejected or Specification Mismatch") {
          return res
            .status(400)
            .json({ message: "Invalid refund type for delivered orders" });
        }

        refundAmount = subtotalWithGST; // Full refund
        break;
      }

      default:
        return res
          .status(400)
          .json({ message: "Invalid order status for refund" });
    }

    // Ensure refundAmount is calculated
    if (refundAmount === undefined || refundAmount === null) {
      return res
        .status(400)
        .json({ message: "Refund amount could not be calculated" });
    }

    const refund = new Refund({
      orderId: order._id,
      orderTrackingId: tracking._id,
      userId: order.user,
      seller: tracking.sellerId || null,
      refundType: type,
      refundAmount,
      deliveryCharges: order.deliveryCharges,
      reason,
      status: "Pending",
    });

    await refund.save();

    // Update the related Sale document with the new refundId
    const sale = await Sale.findOneAndUpdate(
      { ordertrackingId: orderTrackingId },
      { refundId: refund._id },
      { new: true } // Return the updated document
    );

    return res
      .status(201)
      .json({ message: "Refund request created successfully", refund });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getRefundCharges = asyncHandler(async (req, res) => {
  try {
    const { orderTrackingId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderTrackingId)) {
      return res.status(400).json({ message: "Invalid order tracking ID" });
    }

    // Fetch the specific order tracking entry
    const tracking = await OrderTracking.findById(orderTrackingId).populate(
      "orderId"
    );

    if (!tracking) {
      return res.status(404).json({ message: "Order tracking not found" });
    }

    const order = tracking.orderId;

    if (!order || !order.items || order.items.length === 0) {
      return res.status(400).json({ message: "No items found in the order" });
    }

    console.log(order.items, "order.items", tracking, "tracking");
    // Match the tracking entry to an item in order.items using sellerId or another shared attribute
    const trackingItem = order.items.find(
      (item) =>
        item.seller.toString() === tracking.sellerId.toString() &&
        item.product.toString() ===
          tracking.statusUpdates
            .find(
              (update) =>
                update.productId.toString() === item.product.toString()
            )
            ?.productId.toString()
    );

    if (!trackingItem) {
      return res
        .status(400)
        .json({ message: "No item found for the given tracking ID" });
    }

    // Extract the subtotalwithgst for the specific tracking item
    const subtotalWithGST = trackingItem.subtotalwithgst || 0;

    const latestStatus =
      tracking.statusUpdates[tracking.statusUpdates.length - 1]?.status;

    if (!latestStatus) {
      return res
        .status(400)
        .json({ message: "No status updates available for this tracking ID" });
    }

    let refundAmount = null;
    let chargesInfo;

    // Calculate refund based on the order status
    switch (latestStatus) {
      case "Pending":
        refundAmount = subtotalWithGST; // Full refund
        chargesInfo = "Full refund eligible.";
        break;
      case "Confirmed":
        refundAmount = Math.max(0, subtotalWithGST - order.deliveryCharges);
        chargesInfo =
          refundAmount > 0
            ? "Partial refund after deducting delivery charges."
            : "No refund due to delivery charges.";
        break;
      case "Shipped":
        refundAmount = Math.max(0, subtotalWithGST - 2 * order.deliveryCharges);
        chargesInfo =
          refundAmount > 0
            ? "Partial refund after deducting double delivery charges."
            : "No refund due to excessive delivery charges.";
        break;
      case "Delivered":
        const deliveredUpdate = tracking.statusUpdates.find(
          (update) => update.status === "Delivered"
        );

        if (!deliveredUpdate) {
          return res.status(400).json({ message: "Order not delivered yet." });
        }

        const rejectionAllowed =
          new Date() - new Date(deliveredUpdate.timestamp) <=
          3 * 24 * 60 * 60 * 1000;

        if (!rejectionAllowed) {
          return res.status(400).json({ message: "Rejection period expired." });
        }

        refundAmount = subtotalWithGST; // Full refund
        chargesInfo =
          "Full refund for material rejection or specification mismatch.";
        break;

      default:
        return res
          .status(400)
          .json({ message: "Invalid order status for refund calculation." });
    }

    res.status(200).json({
      message: "Refund charges calculated successfully",
      status: latestStatus,
      refundAmount,
      chargesInfo,
    });
  } catch (err) {
    console.error("Error in getRefundCharges:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Handle Order Rejection or Cancellation
const handleOrderRejection = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const rejectionAllowed =
      new Date() - new Date(order.deliveredAt) <= 3 * 24 * 60 * 60 * 1000;
    if (!rejectionAllowed) {
      return res.status(400).json({ message: "Rejection period expired" });
    }

    const refund = await Refund.findOne({ orderId });
    if (!refund)
      return res.status(404).json({ message: "No refund policy found" });

    refund.status = "Processed";
    await refund.save();

    res.status(200).json({ message: "Refund processed successfully", refund });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createRefund, handleOrderRejection, getRefundCharges };
