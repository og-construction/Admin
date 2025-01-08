const mongoose = require("mongoose");

// Define the schema
const sellerpaymentSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming sellerId is an ObjectId from the 'sellers' collection
      required: true,
      ref: "Seller", // Reference to the Seller model, if needed
    },
    orderCreationId: {
      type: String, // String to store the order creation ID
      required: true,
    },
    razorpayPaymentId: {
      type: String, // Razorpay payment ID (e.g., "pay_abc123")
      required: true,
    },
    razorpayOrderId: {
      type: String, // Razorpay order ID (e.g., "order_abc123")
      required: true,
    },
    razorpaySignature: {
      type: String, // Razorpay signature (e.g., signature_abc123)
      required: true,
    },
    amount: {
      type: Number, // Amount in paise or cents, depending on how Razorpay handles it (e.g., 10000 = 100 INR)
      required: true,
    },
    currency: {
      type: String, // Currency of the payment, e.g., "INR"
      required: true,
      default: "INR", // Default currency
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create a model from the schema
const SellerPayment = mongoose.model("SellerPayment", sellerpaymentSchema);

module.exports = SellerPayment;
