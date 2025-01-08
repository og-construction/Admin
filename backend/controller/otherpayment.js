
const OtherPayment = require("../models/otherpayment");

const asyncHandler = require("express-async-handler");
const createOtherPayment = asyncHandler(async (req, res) => {
    const {
      method,
      amount,
      date,
      bankName,
      transactionId,
      ifscCode,
      accountNumber,
      productIds, // Expect an array of product IDs
      sellerId,
    } = req.body;
  
    // Validate required fields
    if (
      !method ||
      !amount ||
      !date ||
      !bankName ||
      !transactionId ||
      !ifscCode ||
      !accountNumber ||
      !Array.isArray(productIds) || // Ensure it's an array
      !sellerId 
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    // Validate payment method
    const validMethods = ["IMPS", "NEFT", "RTGS", "DD", "CHECK"];
    if (!validMethods.includes(method)) {
      return res
        .status(400)
        .json({ message: `Invalid payment method. Choose from ${validMethods}` });
    }
  
    try {
      // Create the OtherPayment document
      const newPayment = new OtherPayment({
        method,
        amount,
        date,
        bankName,
        transactionId,
        ifscCode,
        accountNumber,
        productIds, // Save all product IDs
        sellerId,
      });
  
      await newPayment.save();
  
      res.status(201).json({
        message: "Payment record created successfully",
        payment: newPayment,
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  const orderOtherPayment = asyncHandler(async (req, res) => {
    const {
      method,
      amount,
      date,
      bankName,
      transactionId,
      ifscCode,
      accountNumber,
      productId,
      userId,
    } = req.body;
  
    // Validate required fields
    if (
      !method ||
      !amount ||
      !date ||
      !bankName ||
      !transactionId ||
      !ifscCode ||
      !accountNumber ||
      !productId ||
      !userId

    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    // Validate payment method
    const validMethods = ["IMPS", "NEFT", "RTGS", "DD", "CHECK"];
    if (!validMethods.includes(method)) {
      return res
        .status(400)
        .json({ message: `Invalid payment method. Choose from ${validMethods}` });
    }
  
    try {
      // Create the OtherPayment document
      const newPayment = new OtherPayment({
        method,
        amount,
        date,
        bankName,
        transactionId,
        ifscCode,
        accountNumber,
        productId,
        userId,
      });
  
      await newPayment.save();
  
      res.status(201).json({
        message: "Payment record created successfully",
        payment: newPayment,
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });



  module.exports = { createOtherPayment,orderOtherPayment };