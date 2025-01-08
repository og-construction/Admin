const mongoose = require('mongoose');

const DeliveryChargeSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  baseCharge: { type: Number, required: true },
  perKmCharge: { type: Number, default: 0 }, // Optional charge per kilometer
  weightCharge: { type: Number, default: 0 }, // Optional charge per kilogram
  maxDistance: { type: Number, default: null }, // Optional maximum distance for delivery
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  product:{type:mongoose.Schema.Types.ObjectId, ref: "Product", required: true}
}, { timestamps: true });

module.exports = mongoose.model('DeliveryCharge', DeliveryChargeSchema);
