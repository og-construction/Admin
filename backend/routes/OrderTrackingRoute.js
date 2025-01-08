const express = require('express');
const { addStatusUpdate, getTrackingDetails, getAllTrackingRecords, updateOrderTracking, verifyOtpDelivery } = require('../controller/OrderTrackingCtrl');
const { createRefund, handleOrderRejection, getRefundCharges } = require('../controller/refund');
const router = express.Router();

// Add a status update (Seller)
router.post('/update', addStatusUpdate);

// Get tracking details for an order (Buyer)
router.get('/:orderId', getTrackingDetails);
router.put('/update-ordertracking/:id',updateOrderTracking)
// Get all tracking records (Admin)
router.get('/', getAllTrackingRecords);
router.post("/verify-otp/:id", verifyOtpDelivery);

//-------refund----------------
router.post('/refubd',createRefund)
router.post('/handle-refund',handleOrderRejection)
router.get("/refund-charges/:orderTrackingId", getRefundCharges);

module.exports = router;
