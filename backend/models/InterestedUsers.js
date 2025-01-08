const mongoose = require("mongoose");

const InterestedUserSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the Product model
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller", // Reference to the Seller model
      required: true,
    },
    interestDate: {
      type: Date,
      default: Date.now, // When the user showed interest
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"], // Optional status for managing interest
      default: "Pending",
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("InterestedUser", InterestedUserSchema);
