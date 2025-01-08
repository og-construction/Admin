const mongoose = require('mongoose');

const SellerProductDepositPaymentSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }, // Reference to the Product model
    powerPack: { type: Boolean }, // Indicates if the Power Pack is selected (true/false)
    depositCharges: {
        type: Number,
        default: 0, // Set default to 0
      },
    depositAmount: { type: Number}, // Amount charged for the visibility level
    powerPackAmount: { type: Number,}, // Amount charged for the Power Pack
    totalAmount: { type: Number, required: true }, // Total amount (visibilityAmount + powerPackAmount)
    orderCreationId: { type: String }, // Razorpay order creation ID
    razorpayOrderId: { type: String}, // Razorpay order ID
    razorpayPaymentId: { type: String }, // Razorpay payment ID
    razorpaySignature: { type: String}, // Razorpay payment signature
    createdAt: {
        type: Date,
        default: Date.now
    }, // Timestamp when the record was created
});

const SellerProductDepositPaymentModel = mongoose.model('SellerProductDepositPayment', SellerProductDepositPaymentSchema);
module.exports = SellerProductDepositPaymentModel
