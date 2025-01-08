const Order = require("../models/OrderModel");
const Product = require("../models/productModel");
const Payment = require("../models/paymentModel");
const asyncHandler = require("express-async-handler");
const OrderTracking = require("../models/OrderTrackingModel");
const ejs = require("ejs");
const path = require("path");
const sendEmail = require("./emailCtrl");
const Address = require("../models/addressModel");
const Sale = require("../models/SaleSchema");
const User = require("../models/userModel");

// Helper function to calculate totals
const calculateTotals = (items, deliveryCharges = 0) => {
  let totalAmount = 0;
  let totalGST = 0;

  const processedItems = items.map((item) => {
    const gstValue = item.price * item.quantity * (item.igst / 100); // Calculate GST value
    const subtotal = item.price * item.quantity; // Subtotal includes GST

    totalGST += gstValue;
    totalAmount += subtotal;

    return {
      ...item,
      gst: gstValue, // Rename to 'gst' for consistency
      subtotalwithoutgst: subtotal, // Add subtotal
      subtotalwithgst: subtotal + gstValue, // Add subtotal
      subtotal: subtotal,
    };
  });

  totalAmount += deliveryCharges; // Include delivery charges

  return { totalAmount, totalGST, processedItems };
};

// Create an order
const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryCharges = 0, address } = req.body;
  const userId = req.user._id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Items are required" });
  }

  try {
    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } }).populate(
      "seller"
    );

    if (products.length !== items.length) {
      return res
        .status(400)
        .json({ message: "Some products are invalid or missing" });
    }

    const productMap = products.reduce((acc, product) => {
      acc[product._id.toString()] = product;
      return acc;
    }, {});

    const sellers = new Map();
    const { totalAmount, totalGST, processedItems } = calculateTotals(
      items,
      deliveryCharges
    );
    console.log(processedItems, "processedItems");

    // prodcut stock checing start
    for (const item of processedItems) {
      const product = productMap[item.product];
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}. Available stock: ${product.stock}`,
        });
      }
    }
    // prodcut stock checing end

    const newOrder = new Order({
      user: userId,
      address,
      items: processedItems.map((item) => {
        const subtotalWithoutGST = item.price * item.quantity; // Base price without taxes
        const gstAmount = (item.gst / 100) * subtotalWithoutGST; // Calculate GST from `gst` field
        const igstAmount = (item.igst / 100) * subtotalWithoutGST; // Calculate IGST from `igst` field
        const subtotalWithGST = subtotalWithoutGST + igstAmount; // Total price including GST and IGST
        return {
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          seller: item.seller,
          igst: item.igst,
          gst: item.gst, // Include GST in the item details
          subtotalwithoutgst: subtotalWithoutGST,
          subtotalwithgst: subtotalWithGST, // Total with all applicable taxes
        };
      }),
      totalAmount,
      totalGst: totalGST, // Pass the total GST value explicitly
      deliveryCharges,
      status: "Pending",
    });

    await newOrder.save();

    let foundAddress = await Address.findById(address);
    const user = await User.findById(userId); // Fetch user details

    for (const item of processedItems) {
      // for ordertracking updation
      let ordertrackingresponse = await OrderTracking.create({
        orderId: newOrder._id,
        sellerId: item.seller,
        statusUpdates: [
          { status: "Pending", productId: item.product, timestamp: new Date() },
        ],
      });

      // for sales db updation
      const product = productMap[item.product];

      if (!product) {
        return res
          .status(400)
          .json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}. Available stock: ${product.stock}`,
        });
      }
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();

      if (!sellers.has(product.seller._id.toString())) {
        sellers.set(product.seller._id.toString(), {
          name: product.seller.name,
          email: product.seller.email,
          contact: product.seller.mobile,
          items: [],
        });
      }
      sellers.get(product.seller._id.toString()).items.push(item);

      await Sale.create({
        productId: product._id,
        sellerId: product.seller._id,
        userId,
        price: item.price,
        quantity: item.quantity,
        gst: product.gstNumber,
        subtotalwithoutgst: item.subtotalwithoutgst,
        subtotalwithgst: item.subtotalwithgst,
        ordertrackingId: ordertrackingresponse._id,
      });
    }
    // Send email to the user
    await sendEmail({
      to: req.user.email,
      subject: "Your Order Invoice",
      type: "orderInvoice",
      templateData: {
        orderId: newOrder._id,
        totalAmount,
        gst: totalGST,
        deliveryCharges,
        status: newOrder.status,
        address: foundAddress,
        sellers: Array.from(sellers.values()),
        items: processedItems, // Ensure processedItems contains gst and subtotal
        user: {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
        },
      },
    });

    res.status(201).json({
      message: "Order created successfully",
      orderId: newOrder._id,
      totalAmount,
      gst: totalGST,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
});

// Get all orders for a user with their tracking information and populated details
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find all orders for the user
  const orders = await Order.find({ user: userId });

  // Extract order IDs
  const orderIds = orders.map((order) => order._id);

  // Find all order tracking information for these orders
  const trackingData = await OrderTracking.find(
    { orderId: { $in: orderIds } },
    "-createdAt -updatedAt" // Exclude `createdAt` and `updatedAt` fields
  ).populate({
    path: "statusUpdates.productId",
    populate: [
      { path: "image" }, // Populate `image` of `product`
      { path: "category", select: "name" }, // Populate `category` with only the `name` field
      { path: "subcategory", select: "name" }, // Populate `subcategory` with only the `name` field
    ],
  });

  // Combine orders and tracking data
  const ordersWithTracking = orders.map((order) => {
    const tracking = trackingData.filter(
      (tracking) => tracking.orderId.toString() === order._id.toString()
    );
    return {
      ...order.toObject(),
      tracking,
    };
  });

  res.status(200).json(ordersWithTracking);
});
// Get a single order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate("items.product", "name price")
    .populate("payment");
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.status(200).json(order);
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  await order.save();

  res.status(200).json({ message: "Order status updated successfully", order });
});

const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id; // Assuming the seller is authenticated and their ID is available in req.seller

  try {
    // Step 1: Fetch orders for the seller
    const orders = await Order.find({ "items.seller": sellerId })
      .populate({
        path: "items.product",
        populate: [
          { path: "image" }, // Populate `image` of `product`
          { path: "category", select: "name" }, // Populate `category` with only the `name` field
          { path: "subcategory", select: "name" }, // Populate `subcategory` with only the `name` field
        ],
      })
      .populate("address") // Populate `address` reference
      .populate("user", "name email");

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this seller." });
    }

    // Step 2: Extract order IDs
    const orderIds = orders.map((order) => order._id);

    // Step 3: Fetch Ordertracking data for the orders
    const trackingData = await OrderTracking.find({
      orderId: { $in: orderIds },
    });

    // Step 4: Merge Order and Ordertracking data
    const mergedData = orders.map((order) => {
      const trackingEntries = trackingData.filter((track) =>
        track.orderId.equals(order._id)
      ); // Find all matching tracking entries
      return {
        ...order.toObject(), // Convert Mongoose document to plain object
        tracking: trackingEntries, // Attach all tracking entries
      };
    });

    // Step 5: Send response with merged data
    res.status(200).json(mergedData);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching orders." });
  }
});

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getSellerOrders,
};
