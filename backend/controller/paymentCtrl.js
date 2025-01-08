const Payment = require("../models/paymentModel");
const Seller = require("../models/sellerModel");
const { encrypt, decrypt } = require("../utils/crypto");
const mongoose = require("mongoose");
const razorpay = require("razorpay");
const ProductPayment = require("../models/productpaymentmodel");
const SellerPayment = require("../models/sellerPaymentModel");
const Product = require("../models/productModel");
const VisibilityPayment = require("../models/visibilityPaymentModel");
const asyncHandler = require("express-async-handler"); // Add this import
const Sale = require("../models/SaleSchema");
const MultiplePayment = require("../models/multiplepayment"); // Added this line

const Order = require("../models/OrderModel");
const SellerProductDepositPaymentModel = require("../models/sellerDepositeModel");
const SellerProductVisibilityModel = require("../models/SellerProductvisibilityModel");

const workingKey = process.env.WORKING_KEY;
const accessCode = process.env.ACCESS_CODE;
const merchantId = process.env.MERCHANT_ID;
const redirectUrl = process.env.REDIRECT_URL;
const cancelUrl = process.env.CANCEL_URL;

// Initiate Payment
exports.initiatePayment = async (req, res) => {
  try {
    const { orderId, sellerId } = req.body;

    // Validate inputs
    if (!orderId || !sellerId) {
      return res.status(400).json({
        message: "Order ID, Visibility Tier, and Seller ID are required",
      });
    }

    // Check if seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    // Calculate Charges
    const registrationFee = 11000;
    //const tierCharges = { 1: 500000, 2: 900000, 3: 1400000, 4: 1800000 };
    //  const tierCharge = tierCharges[visibilityTier];
    // if (!tierCharge) {
    // return res.status(400).json({ message: "Invalid Visibility Tier selected" });
    // }
    const totalAmount = registrationFee;
    // Save Payment Record
    const payment = new Payment({
      orderId,
      amount: totalAmount,

      sellerId,
      paymentMode: "Online",
      paymentStatus: "Pending",
    });
    await payment.save();

    // Prepare Payment Gateway Data
    const merchantData = `merchant_id=${merchantId}&order_id=${orderId}&amount=${totalAmount}&currency=INR&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&language=EN`;
    const encryptedData = encrypt(merchantData, workingKey);

    res.status(200).json({
      testUrl:
        "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
      encRequest: encryptedData,
      accessCode,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error initiating payment", error: error.message });
  }
};

// Handle Payment Response
exports.handlePaymentResponse = async (req, res) => {
  try {
    const { encResp } = req.body;
    if (!encResp) {
      console.error("No encResp received");
      return res.status(400).json({ message: "Response data is required" });
    }

    // Log raw response
    console.log("Raw encResp received:", encResp);

    const decryptedResponse = decrypt(encResp, workingKey);
    console.log("Decrypted Response:", decryptedResponse);

    const parsedResponse = new URLSearchParams(decryptedResponse);
    const orderId = parsedResponse.get("order_id");
    const status = parsedResponse.get("order_status");
    const amount = parsedResponse.get("amount");

    if (!status) {
      console.error("order_status is missing");
      return res.status(400).json({
        message: "Invalid payment response: order_status is missing",
        decryptedResponse,
      });
    }

    // Update database and respond
    const payment = await Payment.findOneAndUpdate(
      { orderId },
      { paymentStatus: status, amount },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Payment response handled successfully",
      status,
      payment,
    });
  } catch (error) {
    console.error("Error handling payment response:", error);
    res.status(500).json({
      message: "Error handling payment response",
      error: error.message,
    });
  }
};

// Function to process encResp
const handleEncResp = (encResp) => {
  try {
    const decryptedData = decrypt(encResp, workingKey);
    console.log("Decrypted Response:", decryptedData);

    // Convert the decrypted data to an object for easier access
    const responseParams = new URLSearchParams(decryptedData);
    const orderId = responseParams.get("order_id");
    const status = responseParams.get("order_status");
    const amount = responseParams.get("amount");

    // Log key details
    console.log("Order ID:", orderId);
    console.log("Status:", status);
    console.log("Amount:", amount);

    return responseParams; // Return the parsed response for further use
  } catch (error) {
    console.error("Decryption failed:", error.message, { encResp, workingKey });
  }
};

// Main handler for the response
exports.handlePaymentResponse = async (req, res) => {
  try {
    const { encResp } = req.body; // Extract encResp from the request body
    if (!encResp) {
      return res.status(400).json({ message: "Response data is required" });
    }

    // Decrypt and process encResp
    const responseParams = handleEncResp(encResp);

    // Extract order details
    const orderId = responseParams.get("order_id");
    const status = responseParams.get("order_status");
    const amount = responseParams.get("amount");

    // Update the payment status in your database
    const payment = await Payment.findOneAndUpdate(
      { orderId },
      { paymentStatus: status, amount },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send success response
    res.status(200).json({
      message: "Payment response handled successfully",
      status,
      payment,
    });
  } catch (error) {
    console.error("Error handling payment response:", error);
    res.status(500).json({
      message: "Error handling payment response",
      error: error.message,
    });
  }
};

exports.createpaymentorder = async (req, res) => {
  const { amount } = req.body;
  console.log("Received amount:", amount); // Log the received amount

  if (!amount || amount <= 0) {
    console.error("Invalid amount:", amount); // Log invalid amount
    return res.status(400).json({ message: "Invalid amount provided" });
  }

  const instance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  console.log("Initializing Razorpay instance...");

  try {
    const currency = "INR";
    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Use Math.round to avoid decimals
      currency: currency,
    };
    console.log("Creating Razorpay order with options:", options);

    const order = await instance.orders.create(options);
    // Send the order details to the client
    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// product payment routes
exports.paymentstoretodb = async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      userId,
      cartId,
    } = req.body;

    if (
      !orderCreationId ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !userId ||
      !cartId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const payment = new ProductPayment({
      orderCreationId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      userId,
      cartId,
    });

    await payment.save();
    res
      .status(201)
      .json({ message: "Payment data stored successfully", payment });
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error); // Log the full error

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.StoresellerPayment = async (req, res) => {
  const {
    sellerId,
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    amount,
    currency,
  } = req.body;

  try {
    const newPayment = new SellerPayment({
      sellerId,
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      amount,
      currency,
    });

    // Save the new payment record in the database
    const savedPayment = await newPayment.save();

    res.status(201).json({
      message: "Payment details saved successfully",
      payment: savedPayment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving payment details", error: error.message });
  }
};

exports.storesellervisibilityPayment = async (req, res) => {
  console.log("Received body:", req.body); // Add this line for debugging

  const {
    sellerId,
    products, // Ensure products is received in the request
    totalAmount,
    orderCreationId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  if (!sellerId || !products || products.length === 0 || !totalAmount || !orderCreationId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({
      message: "Missing or invalid required fields",
    });
  }

  try {
    const newVisibilityPayment = new SellerProductVisibilityModel({
      sellerId,
      products, // Save the products array
      totalAmount,
      orderCreationId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentStatus: "Pending",
    });

    const savedPayment = await newVisibilityPayment.save();

    res.status(201).json({
      message: "Seller visibility payment stored successfully",
      data: savedPayment,
    });
  } catch (error) {
    console.error("Error storing seller visibility payment:", error);
    res.status(500).json({
      message: "Failed to store seller visibility payment",
      error: error.message,
    });
  }
};

/*
const calculateVisibilityCharges = (price, maxquantity, visibilityLevel) => {
  if (!price || !maxquantity || !visibilityLevel) {
    throw new Error("Price, max quantity, and visibility level are required");
  }

  const normalizedVisibilityLevel =
    typeof visibilityLevel === "string" ? visibilityLevel.toUpperCase() : null;

  if (!normalizedVisibilityLevel) {
    throw new Error(`Invalid visibility level: ${visibilityLevel}`);
  }

  const productValue = price * maxquantity;

  let charges;

  if (productValue >= 500000) {
    const tierCharges = {
      "1X": 120000,
      "2X": 156000,
      "3X": 202800,
      "4X": 263640,
    };
    charges = tierCharges[normalizedVisibilityLevel];
  } else if (productValue >= 200000) {
    const tierCharges = {
      "1X": 144000,
      "2X": 187200,
      "3X": 243400,
      "4X": 316400,
    };
    charges = tierCharges[normalizedVisibilityLevel];
  } else {
    const valueMultipliers = {
      "1X": 4,
      "2X": 6,
      "3X": 8,
      "4X": 11,
    };

    const minMaxCharges = {
      "1X": { min: 15000, max: 133000 },
      "2X": { min: 19500, max: 172900 },
      "3X": { min: 25350, max: 224800 },
      "4X": { min: 32955, max: 292200 },
    };

    if (!valueMultipliers[normalizedVisibilityLevel] || !minMaxCharges[normalizedVisibilityLevel]) {
      throw new Error(`Invalid visibility level: ${visibilityLevel}`);
    }

    const calculatedCharge = productValue * valueMultipliers[normalizedVisibilityLevel];
    charges = Math.max(
      minMaxCharges[normalizedVisibilityLevel].min,
      Math.min(calculatedCharge, minMaxCharges[normalizedVisibilityLevel].max)
    );
  }

  if (typeof charges === "undefined") {
    throw new Error("Charges calculation failed");
  }

  return charges;
};
*/

const calculateVisibilityCharges = (price, maxquantity, visibilityLevel) => {
  if (!price || !maxquantity || !visibilityLevel) {
    throw new Error("Price, max quantity, and visibility level are required");
  }

  const normalizedVisibilityLevel =
    typeof visibilityLevel === "string" ? visibilityLevel.toUpperCase() : null;

  if (!normalizedVisibilityLevel) {
    throw new Error(`Invalid visibility level: ${visibilityLevel}`);
  }

  const productValue = price * maxquantity;

  let charges;

  if (productValue >= 500000) {
    const tierCharges = {
      "1X": 110000,
      "2X": 121000,
      "3X": 133100,
      "4X": 146400,
    };
    charges = tierCharges[normalizedVisibilityLevel];
  } else if (productValue >= 200000) {
    const tierCharges = {
      "1X": 95000,
      "2X": 104500,
      "3X": 114950,
      "4X": 126445,
    };
    charges = tierCharges[normalizedVisibilityLevel];
  } else {
    const valueMultipliers = {
      "1X": 4,
      "2X": 6,
      "3X": 8,
      "4X": 11,
    };

    const minMaxCharges = {
      "1X": { min: 15000, max: 90000 },
      "2X": { min: 19500, max: 99000 },
      "3X": { min: 25350, max: 108900 },
      "4X": { min: 32955, max: 119790 },
    };

    if (
      !valueMultipliers[normalizedVisibilityLevel] ||
      !minMaxCharges[normalizedVisibilityLevel]
    ) {
      throw new Error(`Invalid visibility level: ${visibilityLevel}`);
    }

    const calculatedCharge =
      productValue * valueMultipliers[normalizedVisibilityLevel];
    charges = Math.max(
      minMaxCharges[normalizedVisibilityLevel].min,
      Math.min(calculatedCharge, minMaxCharges[normalizedVisibilityLevel].max)
    );
  }

  if (typeof charges === "undefined") {
    throw new Error("Charges calculation failed");
  }

  return charges;
};

exports.handleProductCreation = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Missing productId" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { price, maxquantity, visibilityLevel } = product;

    if (!price || !maxquantity || !visibilityLevel) {
      return res.status(400).json({
        message:
          "Product is missing required fields: price, maxquantity, or visibilityLevel",
      });
    }

    // Use the centralized function for calculation
    const visibilityCharges = calculateVisibilityCharges(
      price,
      maxquantity,
      visibilityLevel
    );

    // Save visibility charges and update product
    product.visibilityCharges = visibilityCharges;
    product.approved = false; // Reset approval
    await product.save();

    res.status(200).json({
      message: "Product updated successfully with visibility charges",
      product,
    });
  } catch (error) {
    console.error("Error handling product creation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.initiateVisibilityPayment = async (req, res) => {
  try {
    const { sellerId, products } = req.body;

    if (!sellerId || !products || products.length === 0) {
      return res.status(400).json({ message: "Seller ID and products are required" });
    }

    // Calculate total amount for all products
    const totalAmount = products.reduce((sum, product) => sum + product.totalProductAmount, 0);

    if (totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    // Initialize Razorpay instance
    const instance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create Razorpay order
    const order = await instance.orders.create({
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
    });

    // Save payment details in the database
    const visibilityPayment = new SellerProductVisibilityModel({
      sellerId,
      products,
      totalAmount,
      orderCreationId: order.id,
      razorpayOrderId: order.id,
      paymentStatus: "Pending",
    });

    await visibilityPayment.save();

    res.status(200).json({
      message: "Payment initiated successfully",
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error) {
    console.error("Error initiating visibility payment:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


exports.verifyVisibilityPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const visibilityPayment = await SellerProductVisibilityModel.findOne({ razorpayOrderId: orderId });
    if (!visibilityPayment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // Verify payment (replace with actual Razorpay verification logic)
    const isValid = verifyRazorpayPayment(orderId, paymentId, signature);

    if (!isValid) {
      visibilityPayment.paymentStatus = "Failed";
      await visibilityPayment.save();
      return res.status(400).json({ message: "Invalid payment" });
    }

    // Update payment details
    visibilityPayment.razorpayPaymentId = paymentId;
    visibilityPayment.razorpaySignature = signature;
    visibilityPayment.paymentStatus = "Completed";
    await visibilityPayment.save();

    // Update related product statuses
    for (const product of visibilityPayment.products) {
      const productRecord = await Product.findById(product.productId);
      if (productRecord) {
        productRecord.visibilityChargesPaid = true;
        productRecord.visibilityPayment = true;
        productRecord.approved = true;
        await productRecord.save();
      }
    }

    res.status(200).json({
      message: "Visibility payment verified successfully",
      visibilityPayment,
    });
  } catch (error) {
    console.error("Error verifying visibility payment:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


exports.getSellerBillingHistory = async (req, res) => {
  try {
    const sellerId = req.seller; // Middleware populates this field

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    // Fetch payments as before
    const sellerPayments = await SellerPayment.find({ sellerId })
      .select("orderCreationId razorpayPaymentId amount currency createdAt")
      .lean();

    sellerPayments.forEach((payment) => {
      payment.paymentType = "Registration";
    });

    const visibilityPayments = await VisibilityPayment.find({ sellerId })
      .select("orderId paymentId amount currency createdAt")
      .lean();

    visibilityPayments.forEach((payment) => {
      payment.paymentType = "Visibility";
    });

    const allPayments = [...sellerPayments, ...visibilityPayments];
    allPayments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ payments: allPayments });
  } catch (error) {
    console.error("Error fetching billing history:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//----------------------seller income--------------------

exports.getAllSales = asyncHandler(async (req, res) => {
  try {
    // Extract filters from query parameters
    const { sellerId, userId, productId, startDate, endDate } = req.query;

    // Build a query object based on provided filters
    const query = {};

    if (sellerId) query.sellerId = sellerId;
    if (userId) query.userId = userId;
    if (productId) query.productId = productId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Fetch sales data from the database
    const sales = await Sale.find(query)
      .populate({
        path: "productId",
        populate: [
          { path: "image" }, // Populate 'image' if it's a reference
          { path: "category", select: "name" },
          { path: "subcategory", select: "name" },
        ],
      }) // Populate product details
      .populate("sellerId", "name email") // Populate seller details
      .populate("userId", "name email mobile") // Populate user details
      .populate("ordertrackingId") // Populate order tracking
      .populate("refundId") // Populate refund details if present
      .sort({ createdAt: -1 }); // Sort by latest sales
    // Sort by latest sales

    // Respond with the fetched sales
    res.status(200).json({
      message: "Sales retrieved successfully",
      sales,
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

exports.getSellerIncome = asyncHandler(async (req, res) => {
  const { id } = req.params; // Access 'id' parameter from the URL

  // Log the sellerId for debugging
  console.log("Looking for seller with ID:", id);

  // Find seller
  const seller = await Seller.findById(id); // Use 'id' instead of 'sellerId'
  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  // Get all orders for the seller
  const orders = await Order.find({ "items.seller": id }).populate(
    "items.product"
  );

  // Calculate total income from completed orders
  const totalIncome = orders.reduce((acc, order) => {
    if (order.status === "Completed") {
      acc += order.totalAmount; // Add total amount from completed orders
    }
    return acc;
  }, 0);

  // Calculate weekly, monthly, and yearly income
  const currentDate = new Date();
  const weeklyIncome = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    const diffInDays = (currentDate - orderDate) / (1000 * 3600 * 24);
    if (order.status === "Completed" && diffInDays <= 7) {
      acc += order.totalAmount;
    }
    return acc;
  }, 0);

  const monthlyIncome = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    const diffInMonths =
      currentDate.getMonth() -
      orderDate.getMonth() +
      12 * (currentDate.getFullYear() - orderDate.getFullYear());
    if (order.status === "Completed" && diffInMonths <= 1) {
      acc += order.totalAmount;
    }
    return acc;
  }, 0);

  const yearlyIncome = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    const diffInYears = currentDate.getFullYear() - orderDate.getFullYear();
    if (order.status === "Completed" && diffInYears <= 1) {
      acc += order.totalAmount;
    }
    return acc;
  }, 0);

  res.status(200).json({
    totalIncome,
    weeklyIncome,
    monthlyIncome,
    yearlyIncome,
  });
});

exports.calculateDepositCharges = (price, maxquantity) => {
  if (!price || !maxquantity) {
    throw new Error(
      "Price and max quantity are required to calculate deposit charges."
    );
  }
  const productValue = price * maxquantity;
  const depositCharges = (productValue * 12.5) / 100; // 12.5% of the total product value
  return depositCharges;
};

exports.initiateDepositPayment = async (req, res) => {
  try {
    const { price, maxquantity } = req.body;
    console.log("Request body for initiateDepositPayment:", req.body);

    if (!price || !maxquantity) {
      return res
        .status(400)
        .json({ message: "Price and max quantity are required" });
    }

    // Calculate the deposit charges
    const depositCharges = exports.calculateDepositCharges(price, maxquantity);
    console.log("Calculated Deposit Charges:", depositCharges);

    if (!depositCharges || isNaN(depositCharges)) {
      throw new Error("Deposit charges calculation failed.");
    }

    // Initialize Razorpay
    const instance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create the order
    const order = await instance.orders.create({
      amount: depositCharges * 100, // Convert to paise
      currency: "INR",
    });

    // Save the deposit payment record with a temporary identifier
    const depositPayment = new SellerProductDepositPaymentModel({
      depositCharges,
      totalAmount: depositCharges,
      orderCreationId: order.id,
      razorpayOrderId: order.id,
      paymentStatus: "Pending",
    });

    await depositPayment.save();

    // Return the order details for payment
    res.status(200).json({
      message: "Deposit payment initiated successfully",
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error) {
    console.error("Error initiating deposit payment:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.verifyDepositPayment = async (req, res) => {
  const isAPICall = !!res; // Check if `res` is provided

  try {
    // const body = isAPICall ? req.body : req;
    const { paymentId, orderId, productId } = body;

    // if (!paymentId || !orderId || !productDetails) {
    // const errorMessage = "All fields are required";
    // if (isAPICall) return res.status(400).json({ message: errorMessage });
    // return { status: false, message: errorMessage };
    //  }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const depositPayment = await SellerProductDepositPaymentModel.findOne({
      orderCreationId: orderId,
    });

    if (!depositPayment) {
      const errorMessage = "Deposit payment record not found";
      if (isAPICall) return res.status(404).json({ message: errorMessage });
      return { status: false, message: errorMessage };
    }

    const isValid = verifyRazorpayPayment(orderId, paymentId);
    if (!isValid) {
      depositPayment.paymentStatus = "Failed";
      await depositPayment.save();
      const errorMessage = "Invalid payment";
      if (isAPICall) return res.status(400).json({ message: errorMessage });
      return { status: false, message: errorMessage };
    }

    depositPayment.razorpayPaymentId = paymentId;
    depositPayment.paymentStatus = "Completed";
    await depositPayment.save();

    const successMessage = {
      message: "Deposit payment verified successfully",
      depositPayment,
    };

    if (isAPICall) {
      return res.status(201).json(successMessage);
    }
    return { status: true, ...successMessage };
  } catch (error) {
    console.error("Error verifying deposit payment:", error.message);
    const errorMessage = "Internal server error";
    if (isAPICall) {
      return res.status(500).json({
        message: errorMessage,
        error: error.message,
      });
    }
    return { status: false, message: error.message };
  }
};

exports.storeDepositPayment = async (req, res) => {
  console.log("storeDepositPayment API called");
  console.log("Request body:", req.body);

  const {
    productId,
    depositCharges,
    depositAmount,
    powerPackAmount,
    totalAmount,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  if (
    !productId ||
    !depositCharges ||
    !depositAmount ||
    !powerPackAmount ||
    !totalAmount ||
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature
  ) {
    return res.status(400).json({
      message: "All required fields must be provided",
    });
  }

  try {
    // Create new deposit payment record
    const depositPayment = new SellerProductDepositPaymentModel({
      productId,
      depositCharges,
      depositAmount,
      powerPackAmount,
      totalAmount,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    await depositPayment.save();
    console.log('stored in db',depositPayment)

    // Update product approval status
    const product = await Product.findById(productId);
    if (product) {
      product.depositChargesPaid = true;
      product.approved = true;
      await product.save();
    }
    return res.status(201).json({
      message: "Deposit payment stored successfully",
      depositPayment,
    });
  } catch (error) {
    console.error("Error in storeDepositPayment:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};



/*
exports.initiateMultiplePayments = async (req, res) => {
  try {
    const { sellerId, selectedDetails, totalAmount } = req.body;

    if (!sellerId || !selectedDetails || selectedDetails.length === 0) {
      return res.status(400).json({ message: "Seller ID and products are required" });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    const instance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.create({
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
    });
    console.log("Created Razorpay order:", order);

    const paymentRecords = selectedDetails.map((product) => ({
      productId: product.id,
      saleType: product.saleType,
      visibilityLevel: product.visibilityLevel || "1X",
      powerPack: product.powerPack || false,
      visibilityAmount: product.visibilityAmount || 0,
      powerPackAmount: product.powerPackAmount || 0,
      depositAmount: product.depositAmount || 0,
      totalProductAmount: product.totalProductAmount || 0,
      paymentStatus: "Pending",
    }));

    const multiplePayment = new MultiplePayment({
      sellerId,
      orderId: order.id,
      razorpayOrderId: order.id,
      totalAmount,
      products: paymentRecords,
      paymentStatus: "Pending",
    });

    await multiplePayment.save();

    res.status(200).json({
      message: "Multiple payments initiated successfully",
      paymentUrl: `https://checkout.razorpay.com/v1/checkout.js?order_id=${order.id}`,
    });
  } catch (error) {
    console.error("Error initiating multiple payments:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
*/




/*
exports.verifyMultiplePayments = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const payment = await MultiplePayment.findOne({ razorpayOrderId: orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (!verifyRazorpayPayment(orderId, paymentId, signature)) {
      payment.paymentStatus = "Failed";
      await payment.save();
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    payment.paymentStatus = "Completed";
    await payment.save();

    res.status(200).json({ message: "Multiple payments verified successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



exports.storeMultiplePayments = async (req, res) => {
  const { orderId, paymentDetails } = req.body;

  if (!orderId || !paymentDetails) {
    return res.status(400).json({ message: "Order ID and payment details are required" });
  }

  try {
    const payment = await MultiplePayment.findOne({ razorpayOrderId: orderId });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    const isValidSignature = verifyRazorpayPayment(orderId, paymentDetails.razorpayPaymentId, paymentDetails.razorpaySignature);

    if (!isValidSignature) {
      payment.paymentStatus = "Failed";
      await payment.save();
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    payment.paymentStatus = "Completed";
    payment.razorpayPaymentId = paymentDetails.razorpayPaymentId;
    payment.razorpaySignature = paymentDetails.razorpaySignature;

    payment.products.forEach((product) => {
      product.paymentStatus = "Completed";
    });

    await payment.save();

    res.status(200).json({ message: "Payment stored successfully", payment });
  } catch (error) {
    console.error("Error in storeMultiplePayments:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


*/




