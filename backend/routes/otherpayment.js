const express = require("express");
const router = express.Router();
const { authSellerMiddleware, authUserMiddleware } = require("../middlewares/authMiddleware"); // Use require
const { createOtherPayment, orderOtherPayment } = require("../controller/otherpayment");

// Define the route
router.post("/other-payment-seller", authSellerMiddleware, createOtherPayment);
router.post("/other-payment-user",  orderOtherPayment);


module.exports = router;
