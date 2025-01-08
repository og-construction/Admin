const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  priceUnit: {
    type: String,
    enum: ["Perkg", "PerNumber", "PerMeter", "PerLiter", "PerCum", "PerCft", "PerMT", "PerBox", "PerRF", "PerRM", "PerLtr", "PerSqft", "perBundle", "PerRoll"]
  },
  size: { type: String, required: true },
  maxquantity: { type: Number, required: true },
  minquantity: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  image: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true }, // Reference to FileModel
  visibilityLevel: {
    type: String,
    enum: ["1X", "2X", "3X", "4X"], // Valid visibility levels
    default: "1X", // Default value
  },
  videoPriority: {
    type: [String], // An array of strings
    enum: ["1XVIDEO", "3XVIDEO"], // Allowed values
    default: [], // Default to an empty array
  },
  slug: String,
  specifications: [
    {
      key: { type: String },
      value: { type: String },
    },
  ],
  images: [
    { type: mongoose.Schema.Types.ObjectId, ref: "File" }, // Array of references to FileModel
  ],
  approved: { type: Boolean, default: false },
  visibilityPayment: { type: Boolean, default: false },
  visibilityCharges: { type: Number, default: 0 }, // Add this field
  PowerPackVisibility: { type: Boolean, default: false }, //ap
  saleType: {
    type: String,
    enum: ["Sale By Seller", "Sale By OGCS"], // Sale type options
    required: true,
  },
  deliveryCharge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryCharge",
  },
  depositPayment: { type: Boolean, default: false },
  ratings: [
    {
      star: { type: Number, required: true },
      postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  totalratings: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  gstNumber: { type: Number, required: true },
  hsnCode: { type: String, required: true },
  deliveryPreference: {
    unit: { type: String, required: true }, // E.g., 'days', 'weeks', 'months'
    duration: { type: Number, required: true }, // E.g., 5, 10, etc.
  }
});

module.exports = mongoose.model("Product", ProductSchema);
