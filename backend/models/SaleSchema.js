const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  gst: { type: Number, required: true },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  subtotalwithoutgst: { type: Number, required: true },
  subtotalwithgst: { type: Number, required: true },
  ordertrackingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderTracking",
    required: true,
  },
  refundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Refund",
  },
});

module.exports = mongoose.model("Sale", SaleSchema);
