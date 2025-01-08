const mongoose = require("mongoose");

const OrderTrackingSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    statusUpdates: [
      {
        status: {
          type: String,
          enum: [
            "Pending",
            "Confirmed",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
          ],
        },
        reason: {
          type: String,
        },
        timestamp: { type: Date, default: Date.now },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    dispatchDetails: {
      dispatchDate: { type: Date },
      expectedDeliveryDate: { type: Date },
      referenceNumber: { type: String },
    },
    otp: { type: String }, // Temporary OTP storage
    otpExpiresAt: { type: Date }, // OTP expiration time
  },

  { timestamps: true }
);

module.exports = mongoose.model("OrderTracking", OrderTrackingSchema);
