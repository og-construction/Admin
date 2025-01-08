const mongoose = require('mongoose');

const ProductPaymentSchema = new mongoose.Schema({
    orderCreationId: { type: String, required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },
    razorpaySignature: { type: String, required: true },
    userId: { type: String, required: true },
    cartId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ProductPayment', ProductPaymentSchema);
