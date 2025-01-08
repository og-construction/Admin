const mongoose = require("mongoose");

const MultiplePaymentSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayOrderId: { type: String, required: true, unique: true },

    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        saleType: {
            type: String,
            enum: ["Sale By Seller", "Sale By OGCS"], // Sale type options
            required: true,
          },

        visibilityLevel: {
          type: String,
          required: true,
        },
        powerPack: {
          type: Boolean,
          default: false,
        },
        visibilityAmount: {
          type: Number,
          required: true,
        },
        powerPackAmount: {
          type: Number,
          default: 0,
        },
        depositAmount: {
          type: Number,
          required: true,
        },
        totalProductAmount: {
          type: Number,
          required: true,
        },
        paymentStatus: {
          type: String,
          enum: ["Pending", "Completed", "Failed"],
          default: "Pending",
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MultiplePayment", MultiplePaymentSchema);
