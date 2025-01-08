const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  //visibilityTier: { type: Number, required: true },
  paymentStatus: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  paymentMode: { type: String, enum: ['Online', 'Card', 'Net Banking'], required: true },
});

module.exports = mongoose.model("Payment", paymentSchema);
