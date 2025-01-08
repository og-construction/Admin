const mongoose = require("mongoose");

const SellerProductVisibilitySchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      visibilityLevel: { type: String, default: "1X" },
      visibilityAmount: { type: Number, },
      powerPack: { type: Boolean, default: false },
      powerPackAmount: { type: Number, default: 0 },
      totalProductAmount: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true }, // Total amount for all products
  orderCreationId: { type: String, required: true }, // Razorpay order creation ID
  razorpayOrderId: { type: String, required: true }, // Razorpay order ID
  razorpayPaymentId: { type: String }, // Razorpay payment ID (set later after payment)
  razorpaySignature: { type: String }, // Razorpay payment signature (set later after payment)
  paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const SellerProductVisibilityModel = mongoose.model(
  "SellerProductVisibilityPayment",
  SellerProductVisibilitySchema
);

module.exports = SellerProductVisibilityModel;
