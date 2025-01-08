const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true }, // Ensure this field exists
      igst: { type: Number, required: true },
      subtotalwithoutgst: { type: Number, required: true },
      subtotalwithgst: { type: Number, required: true },
    },

  ],
  totalAmount: { type: Number, required: true },
  totalGst: { type: Number, required: true },
  deliveryCharges: { type: Number, default: 0 },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
