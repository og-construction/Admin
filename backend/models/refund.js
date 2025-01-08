// refund.js (Model)
const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    orderTrackingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderTracking',
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    refundType: {
        type: String,
        required: true
    },
    refundAmount: {
        type: Number,
        required: true
    },
    deliveryCharges: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: [
            "Pending",
            "Confirmed",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
        ],
        default: 'Pending'
    },
    reason: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Refund', refundSchema);
