const mongoose = require("mongoose");
const VisibilityPaymentSchema = new mongoose.Schema(
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
      },
      orderId: {
        type: String,
        required: true,
      },
      paymentId: {
        type: String, // Make it optional for initiation
      },
      amount: {
        type: Number,
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
      },
      paymentMode: {
        type: String,
        enum: ["Online", "Offline"],
        default: "Online",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("VisibilityPayment", VisibilityPaymentSchema);
  