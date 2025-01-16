const asyncHandler = require("express-async-handler");
const User = require("../models/userModel"); 
const Address = require("../models/addressModel"); 
const Admin = require("../models/adminModel"); 
const Cart = require("../models//CartModel");
const Category = require("../models/CategoryModel");
const Subcategory = require("../models/SubCategory"); 
const DeliveryCharge = require("../models/deliveryCharge"); 
const InterestedUser = require("../models/InterestedUsers"); 
const OtherPayment = require("../models/otherpayment"); 
const Order = require("../models/OrderModel"); 
const OrderTracking = require("../models/OrderTrackingModel"); 
const ProductPayment = require("../models/productpaymentmodel"); 
const SellerProductVisibility = require("../models/SellerProductvisibilityModel"); 
const Seller = require("../models/sellerModel"); 
const Wishlist = require("../models/Wishlist");


// Controller to get order summary by the latest status
const getOrderSummary = asyncHandler(async (req, res) => {
  try {
    // Aggregate the count of orders based on their latest status
    const summary = await OrderTracking.aggregate([
      {
        $project: {
          latestStatus: { $arrayElemAt: ["$statusUpdates", -1] }, // Get the last element from the statusUpdates array
        },
      },
      {
        $group: {
          _id: "$latestStatus.status", // Group by the latest status
          count: { $sum: 1 }, // Count each status occurrence
        },
      },
    ]);

    // Map results into a structured response
    const statusCounts = summary.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json({
      totalPendingOrder: statusCounts["Pending"] || 0,
      totalConfirmedOrder: statusCounts["Confirmed"] || 0,
      totalCanceledOrder: statusCounts["Canceled"] || 0,
      totalDeliveredOrder: statusCounts["Delivered"] || 0,
      totalShippedOrder: statusCounts["Shipped"] || 0,
    });
  } catch (error) {
    console.error("Error fetching order summary:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching the order summary.",
    });
  }
});



const getPendingOrders = asyncHandler(async (req, res) => {
    try {
      // Fetch orders where the latest status is "Pending"
      const pendingOrders = await OrderTracking.aggregate([
        {
          $addFields: {
            latestStatus: { $arrayElemAt: ["$statusUpdates", -1] }, // Add a field for the last status
          },
        },
        {
          $match: {
            "latestStatus.status": "Pending", // Filter only orders with latest status as "Pending"
          },
        },
      ]);
  
      // Populate `sellerId` and `userId` using a separate query
      const populatedOrders = await OrderTracking.populate(pendingOrders, [
        { path: "sellerId", select: "name email" },
        { path: "userId", select: "name email" },
      ]);
  
      // Format the response
      const formattedOrders = populatedOrders.map((order) => ({
        orderId: order.orderId,
        sellerName: order.sellerId?.name || "N/A",
        sellerEmail: order.sellerId?.email || "N/A",
        userName: order.userId?.name || "N/A",
        userEmail: order.userId?.email || "N/A",
        latestStatus: order.latestStatus,
        createdAt: order.createdAt,
      }));
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Error fetching pending orders:", error.message);
      res.status(500).json({
        error: "An error occurred while fetching pending orders.",
      });
    }
  });

 
const getConfirmedOrders = asyncHandler(async (req, res) => {
    try {
      // Fetch orders where the latest status is "Confirmed"
      const confirmedOrders = await OrderTracking.aggregate([
        {
          $addFields: {
            latestStatus: { $arrayElemAt: ["$statusUpdates", -1] }, // Extract the last status update
          },
        },
        {
          $match: {
            "latestStatus.status": "Confirmed", // Match only orders where the latest status is "Confirmed"
          },
        },
      ]);
  
      // Populate `sellerId` and `userId` fields
      const populatedOrders = await OrderTracking.populate(confirmedOrders, [
        { path: "sellerId", select: "name email" },
        { path: "userId", select: "name email" },
      ]);
  
      // Format the response with fallback values
      const formattedOrders = populatedOrders.map((order) => ({
        orderId: order.orderId,
        sellerName: order.sellerId?.name || "N/A",
        sellerEmail: order.sellerId?.email || "N/A",
        userName: order.userId?.name || "N/A",
        userEmail: order.userId?.email || "N/A",
        latestStatus: order.latestStatus,
        createdAt: order.createdAt,
      }));
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Error fetching confirmed orders:", error.message);
      res.status(500).json({
        error: "An error occurred while fetching confirmed orders.",
      });
    }
  });
  const getShippedOrders = asyncHandler(async (req, res) => {
    try {
      // Fetch orders where the latest status is "Shipped"
      const ShippedOrders = await OrderTracking.aggregate([
        {
          $addFields: {
            latestStatus: { $arrayElemAt: ["$statusUpdates", -1] }, // Add a field for the last status
          },
        },
        {
          $match: {
            "latestStatus.status": "Shipped", // Filter only orders with latest status as "Shipped"
          },
        },
      ]);
  
      // Populate `sellerId` and `userId` using a separate query
      const populatedOrders = await OrderTracking.populate(ShippedOrders, [
        { path: "sellerId", select: "name email" },
        { path: "userId", select: "name email" },
      ]);
  
      // Format the response
      const formattedOrders = populatedOrders.map((order) => ({
        orderId: order.orderId,
        sellerName: order.sellerId?.name || "N/A",
        sellerEmail: order.sellerId?.email || "N/A",
        userName: order.userId?.name || "N/A",
        userEmail: order.userId?.email || "N/A",
        latestStatus: order.latestStatus,
        createdAt: order.createdAt,
      }));
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Error fetching pending orders:", error.message);
      res.status(500).json({
        error: "An error occurred while fetching pending orders.",
      });
    }
  });


  const getDeliveredOrders = asyncHandler(async (req, res) => {
    try {
      // Fetch orders where the latest status is "Shipped"
      const DeliveredOrders = await OrderTracking.aggregate([
        {
          $addFields: {
            latestStatus: { $arrayElemAt: ["$statusUpdates", -1] }, // Add a field for the last status
          },
        },
        {
          $match: {
            "latestStatus.status": "Delivered", // Filter only orders with latest status as "Shipped"
          },
        },
      ]);
  
      // Populate `sellerId` and `userId` using a separate query
      const populatedOrders = await OrderTracking.populate(DeliveredOrders, [
        { path: "sellerId", select: "name email" },
        { path: "userId", select: "name email" },
      ]);
  
      // Format the response
      const formattedOrders = populatedOrders.map((order) => ({
        orderId: order.orderId,
        sellerName: order.sellerId?.name || "N/A",
        sellerEmail: order.sellerId?.email || "N/A",
        userName: order.userId?.name || "N/A",
        userEmail: order.userId?.email || "N/A",
        latestStatus: order.latestStatus,
        createdAt: order.createdAt,
      }));
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Error fetching pending orders:", error.message);
      res.status(500).json({
        error: "An error occurred while fetching pending orders.",
      });
    }
  });

  const getCancelledOrders = asyncHandler(async (req, res) => {
    try {
      // Fetch orders where the latest status is "Shipped"
      const CancelledOrders = await OrderTracking.aggregate([
        {
          $addFields: {
            latestStatus: { $arrayElemAt: ["$statusUpdates", -1] }, // Add a field for the last status
          },
        },
        {
          $match: {
            "latestStatus.status": "Cancelled", // Filter only orders with latest status as "Shipped"
          },
        },
      ]);
  
      // Populate `sellerId` and `userId` using a separate query
      const populatedOrders = await OrderTracking.populate(CancelledOrders, [
        { path: "sellerId", select: "name email" },
        { path: "userId", select: "name email" },
      ]);
  
      // Format the response
      const formattedOrders = populatedOrders.map((order) => ({
        orderId: order.orderId,
        sellerName: order.sellerId?.name || "N/A",
        sellerEmail: order.sellerId?.email || "N/A",
        userName: order.userId?.name || "N/A",
        userEmail: order.userId?.email || "N/A",
        latestStatus: order.latestStatus,
        createdAt: order.createdAt,
      }));
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Error fetching pending orders:", error.message);
      res.status(500).json({
        error: "An error occurred while fetching pending orders.",
      });
    }
  });



  // Controller to get all users
const getUsersdata = asyncHandler(async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});

    // Format the response (optional, if specific formatting is needed)
    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      type: user.type,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching users.",
    });
  }
});


// Controller to get all address data
const getAllAddresses = asyncHandler(async (req, res) => {
  try {
    // Fetch all addresses from the database
    const addresses = await Address.find({}).populate("userId", "name email"); // Populate user details if needed

    // Format the response (optional, if specific formatting is needed)
    const formattedAddresses = addresses.map((address) => ({
      id: address._id,
      userId: address.userId?._id || "N/A",
      userName: address.userId?.name || "N/A",
      userEmail: address.userId?.email || "N/A",
      mobileNumber: address.mobileNumber,
      postalCode: address.postalCode,
      houseNumberOrApartment: address.houseNumberOrApartment,
      areaOrStreet: address.areaOrStreet,
      landmark: address.landmark || "N/A",
      cityOrTown: address.cityOrTown,
      selectedState: address.selectedState,
      latitude: address.latitude || "N/A",
      longitude: address.longitude || "N/A",
      selectedPlace: address.selectedPlace || "N/A",
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    }));

    res.status(200).json(formattedAddresses);
  } catch (error) {
    console.error("Error fetching addresses:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching addresses.",
    });
  }
});



// Controller to get all admin data
const getAdminData = asyncHandler(async (req, res) => {
  try {
    // Fetch all admin records from the database
    const admins = await Admin.find({});

    // Format the response (optional, if specific formatting is needed)
    const formattedAdmins = admins.map((admin) => ({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      mobile: admin.mobile,
      role: admin.role,
      isVerified: admin.isVerified,
      isBlocked: admin.isBlocked,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }));

    res.status(200).json(formattedAdmins);
  } catch (error) {
    console.error("Error fetching admins:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching admins.",
    });
  }
});



// Controller to get all cart data
const getCartData = asyncHandler(async (req, res) => {
  try {
    // Fetch all cart records from the database
    const carts = await Cart.find({})
      .populate("userId", "name email")
      .populate("items.productId", "name price")
      .populate("items.image", "url"); // Populate referenced fields

    // Format the response
    const formattedCarts = carts.map((cart) => ({
      id: cart._id,
      userId: cart.userId?._id || "N/A",
      userName: cart.userId?.name || "N/A",
      userEmail: cart.userId?.email || "N/A",
      items: cart.items.map((item) => ({
        productId: item.productId?._id || "N/A",
        productName: item.productId?.name || "N/A",
        productPrice: item.productId?.price || "N/A",
        quantity: item.quantity,
        image: item.image?.url || "N/A",
      })),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    }));

    res.status(200).json(formattedCarts);
  } catch (error) {
    console.error("Error fetching cart data:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching cart data.",
    });
  }
});

// Controller to get all category data
const getCategoryData = asyncHandler(async (req, res) => {
  try {
    // Fetch all category records from the database
    const categories = await Category.find({});

    // Format the response
    const formattedCategories = categories.map((category) => ({
      id: category._id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));

    res.status(200).json(formattedCategories);
  } catch (error) {
    console.error("Error fetching category data:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching category data.",
    });
  }
});

// Controller to get all subcategory data
const getSubcategoryData = asyncHandler(async (req, res) => {
  try {
    // Fetch all subcategory records from the database
    const subcategories = await Subcategory.find({}).populate("category", "name");

    // Format the response
    const formattedSubcategories = subcategories.map((subcategory) => ({
      id: subcategory._id,
      name: subcategory.name,
      categoryId: subcategory.category?._id || "N/A",
      categoryName: subcategory.category?.name || "N/A",
      image: subcategory.image,
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt,
    }));

    res.status(200).json(formattedSubcategories);
  } catch (error) {
    console.error("Error fetching subcategory data:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching subcategory data.",
    });
  }
});

// Controller to get all delivery charges data
const getDeliveryChargesData = asyncHandler(async (req, res) => {
  try {
    // Fetch all delivery charge records from the database
    const deliveryCharges = await DeliveryCharge.find({})
      .populate("seller", "name email")
      .populate("product", "name price"); // Populate referenced fields

    // Format the response
    const formattedDeliveryCharges = deliveryCharges.map((charge) => ({
      id: charge._id,
      sellerId: charge.seller?._id || "N/A",
      sellerName: charge.seller?.name || "N/A",
      sellerEmail: charge.seller?.email || "N/A",
      productId: charge.product?._id || "N/A",
      productName: charge.product?.name || "N/A",
      productPrice: charge.product?.price || "N/A",
      baseCharge: charge.baseCharge,
      perKmCharge: charge.perKmCharge,
      weightCharge: charge.weightCharge,
      maxDistance: charge.maxDistance,
      createdAt: charge.createdAt,
      updatedAt: charge.updatedAt,
    }));

    res.status(200).json(formattedDeliveryCharges);
  } catch (error) {
    console.error("Error fetching delivery charges data:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching delivery charges data.",
    });
  }
});



// Controller to get all interested user data
const getInterestedUserData = asyncHandler(async (req, res) => {
  try {
    // Fetch all interested user records from the database
    const interestedUsers = await InterestedUser.find({})
      .populate("userId", "name email") // Populate user details
      .populate("productId", "name price") // Populate product details
      .populate("sellerId", "name email"); // Populate seller details

    // Format the response
    const formattedInterestedUsers = interestedUsers.map((interest) => ({
      id: interest._id,
      userId: interest.userId?._id || "N/A",
      userName: interest.userId?.name || "N/A",
      userEmail: interest.userId?.email || "N/A",
      productId: interest.productId?._id || "N/A",
      productName: interest.productId?.name || "N/A",
      productPrice: interest.productId?.price || "N/A",
      sellerId: interest.sellerId?._id || "N/A",
      sellerName: interest.sellerId?.name || "N/A",
      sellerEmail: interest.sellerId?.email || "N/A",
      interestDate: interest.interestDate,
      status: interest.status,
      createdAt: interest.createdAt,
      updatedAt: interest.updatedAt,
    }));

    res.status(200).json(formattedInterestedUsers);
  } catch (error) {
    console.error("Error fetching interested user data:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching interested user data.",
    });
  }
});



// Controller to get all other payment data
const getOtherPaymentData = asyncHandler(async (req, res) => {
  try {
    // Fetch all other payment records from the database
    const otherPayments = await OtherPayment.find({})
      .populate("productIds", "name price") // Populate product details
      .populate("sellerId", "name email") // Populate seller details
      .populate("userId", "name email") // Populate user details
      .populate("orderId", "orderId"); // Populate order details

    // Format the response
    const formattedOtherPayments = otherPayments.map((payment) => ({
      id: payment._id,
      method: payment.method,
      amount: payment.amount,
      date: payment.date,
      bankName: payment.bankName,
      transactionId: payment.transactionId,
      ifscCode: payment.ifscCode,
      accountNumber: payment.accountNumber,
      productDetails: payment.productIds.map((product) => ({
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
      })),
      sellerDetails: {
        sellerId: payment.sellerId?._id || "N/A",
        sellerName: payment.sellerId?.name || "N/A",
        sellerEmail: payment.sellerId?.email || "N/A",
      },
      userDetails: {
        userId: payment.userId?._id || "N/A",
        userName: payment.userId?.name || "N/A",
        userEmail: payment.userId?.email || "N/A",
      },
      orderDetails: {
        orderId: payment.orderId?._id || "N/A",
        orderReference: payment.orderId?.orderId || "N/A",
      },
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }));

    res.status(200).json(formattedOtherPayments);
  } catch (error) {
    console.error("Error fetching other payment data:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching other payment data.",
    });
  }
});

// Controller to get all order data
const getOrderData = asyncHandler(async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find({})
      .populate("user", "name email") // Populate user details
      .populate("address", "areaOrStreet cityOrTown selectedState postalCode") // Populate address details
      .populate("items.product", "name price") // Populate product details in items
      .populate("items.seller", "name email") // Populate seller details in items
      .populate("payment", "paymentMethod paymentStatus"); // Populate payment details

    // Format the response
    const formattedOrders = orders.map((order) => ({
      id: order._id,
      user: {
        userId: order.user?._id || "N/A",
        userName: order.user?.name || "N/A",
        userEmail: order.user?.email || "N/A",
      },
      address: {
        addressId: order.address?._id || "N/A",
        areaOrStreet: order.address?.areaOrStreet || "N/A",
        cityOrTown: order.address?.cityOrTown || "N/A",
        selectedState: order.address?.selectedState || "N/A",
        postalCode: order.address?.postalCode || "N/A",
      },
      items: order.items.map((item) => ({
        productId: item.product?._id || "N/A",
        productName: item.product?.name || "N/A",
        productPrice: item.product?.price || 0,
        quantity: item.quantity,
        price: item.price,
        seller: {
          sellerId: item.seller?._id || "N/A",
          sellerName: item.seller?.name || "N/A",
          sellerEmail: item.seller?.email || "N/A",
        },
        igst: item.igst,
        subtotalWithoutGst: item.subtotalwithoutgst,
        subtotalWithGst: item.subtotalwithgst,
      })),
      totalAmount: order.totalAmount,
      totalGst: order.totalGst,
      deliveryCharges: order.deliveryCharges,
      payment: {
        paymentId: order.payment?._id || "N/A",
        paymentMethod: order.payment?.paymentMethod || "N/A",
        paymentStatus: order.payment?.paymentStatus || "N/A",
      },
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching order data:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching order data.",
    });
  }
});



// Controller to get all order tracking data
const getOrderTrackingData = asyncHandler(async (req, res) => {
  try {
    // Fetch all order tracking records from the database
    const orderTrackings = await OrderTracking.find({})
      .populate("orderId", "user address totalAmount status") // Populate order details
      .populate("sellerId", "name email") // Populate seller details
      .populate("userId", "name email") // Populate user details
      .populate("statusUpdates.productId", "name price"); // Populate product details in statusUpdates

    // Format the response
    const formattedOrderTrackings = orderTrackings.map((tracking) => ({
      id: tracking._id,
      order: {
        orderId: tracking.orderId?._id || "N/A",
        totalAmount: tracking.orderId?.totalAmount || 0,
        status: tracking.orderId?.status || "N/A",
        user: tracking.orderId?.user || "N/A",
        address: tracking.orderId?.address || "N/A",
      },
      seller: {
        sellerId: tracking.sellerId?._id || "N/A",
        sellerName: tracking.sellerId?.name || "N/A",
        sellerEmail: tracking.sellerId?.email || "N/A",
      },
      user: {
        userId: tracking.userId?._id || "N/A",
        userName: tracking.userId?.name || "N/A",
        userEmail: tracking.userId?.email || "N/A",
      },
      statusUpdates: tracking.statusUpdates.map((statusUpdate) => ({
        status: statusUpdate.status,
        reason: statusUpdate.reason || "N/A",
        timestamp: statusUpdate.timestamp,
        product: {
          productId: statusUpdate.productId?._id || "N/A",
          productName: statusUpdate.productId?.name || "N/A",
          productPrice: statusUpdate.productId?.price || 0,
        },
      })),
      dispatchDetails: tracking.dispatchDetails || "N/A",
      otp: tracking.otp || "N/A",
      otpExpiresAt: tracking.otpExpiresAt || "N/A",
      createdAt: tracking.createdAt,
      updatedAt: tracking.updatedAt,
    }));

    res.status(200).json(formattedOrderTrackings);
  } catch (error) {
    console.error("Error fetching order tracking data:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching order tracking data.",
    });
  }
});


// Controller to fetch all product payment data
const getProductPaymentData = asyncHandler(async (req, res) => {
  try {
    // Fetch all product payment records with populated references
    const productPayments = await ProductPayment.find({})
      .populate("userId", "name email mobile") // Populate user details
      .populate("cartId", "items"); // Populate cart details

    // Format the response
    const formattedProductPayments = productPayments.map((payment) => ({
      id: payment._id,
      orderCreationId: payment.orderCreationId,
      razorpayOrderId: payment.razorpayOrderId,
      razorpayPaymentId: payment.razorpayPaymentId,
      razorpaySignature: payment.razorpaySignature,
      user: {
        userId: payment.userId?._id || "N/A",
        userName: payment.userId?.name || "N/A",
        userEmail: payment.userId?.email || "N/A",
        userMobile: payment.userId?.mobile || "N/A",
      },
      cart: {
        cartId: payment.cartId?._id || "N/A",
        items: payment.cartId?.items || [],
      },
      createdAt: payment.createdAt,
    }));

    // Return the enhanced response
    res.status(200).json(formattedProductPayments);
  } catch (error) {
    console.error("Error fetching product payment data:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching product payment data.",
    });
  }
});
// Controller to get all Seller Product Visibility data
const getAllSellerProductVisibility = asyncHandler(async (req, res) => {
  try {
    // Fetch all seller product visibility records with populated references
    const visibilityData = await SellerProductVisibility.find({})
      .populate("sellerId", "name email") // Populate seller details
      .populate("products.productId", "name price categoryId"); // Populate product details

    // Format the response
    const formattedData = visibilityData.map((record) => ({
      id: record._id,
      seller: {
        sellerId: record.sellerId?._id || "N/A",
        sellerName: record.sellerId?.name || "N/A",
        sellerEmail: record.sellerId?.email || "N/A",
      },
      products: record.products.map((product) => ({
        productId: product.productId?._id || "N/A",
        productName: product.productId?.name || "N/A",
        productPrice: product.productId?.price || "N/A",
        productCategory: product.productId?.categoryId || "N/A",
        visibilityLevel: product.visibilityLevel,
        visibilityAmount: product.visibilityAmount || 0,
        powerPack: product.powerPack,
        powerPackAmount: product.powerPackAmount || 0,
        totalProductAmount: product.totalProductAmount,
      })),
      totalAmount: record.totalAmount,
      paymentDetails: {
        orderCreationId: record.orderCreationId,
        razorpayOrderId: record.razorpayOrderId,
        razorpayPaymentId: record.razorpayPaymentId || "N/A",
        razorpaySignature: record.razorpaySignature || "N/A",
        paymentStatus: record.paymentStatus,
      },
      createdAt: record.createdAt,
    }));

    // Send the formatted response
    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching seller product visibility data:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching seller product visibility data.",
    });
  }
});


// Controller to fetch all sellers
const getSellersdata = asyncHandler(async (req, res) => {
  try {
    // Fetch all sellers with virtual `products` populated
    const sellers = await Seller.find({})
      .populate("interestedUsers.userId", "name email") // Populate interested user details
      .populate("interestedUsers.productId", "name price") // Populate interested product details
      .populate("products", "name price categoryId"); // Populate seller products

    // Format the response (optional)
    const formattedSellers = sellers.map((seller) => ({
      id: seller._id,
      name: seller.name,
      email: seller.email,
      mobile: seller.mobile,
      gstNumber: seller.gstNumber,
      companyName: seller.companyName,
      pan: seller.pan,
      role: seller.role,
      isVerified: seller.isVerified,
      isBlocked: seller.isBlocked,
      address: seller.address,
      products: seller.products.map((product) => ({
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
        productCategory: product.categoryId,
      })),
      interestedUsers: seller.interestedUsers.map((interest) => ({
        userId: interest.userId?._id || "N/A",
        userName: interest.userId?.name || "N/A",
        userEmail: interest.userId?.email || "N/A",
        productId: interest.productId?._id || "N/A",
        productName: interest.productId?.name || "N/A",
        productPrice: interest.productId?.price || "N/A",
        date: interest.date,
      })),
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    }));

    res.status(200).json(formattedSellers);
  } catch (error) {
    console.error("Error fetching sellers:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching sellers.",
    });
  }
});


// Controller to fetch a seller by ID
const getSellerById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the seller by ID with virtual `products` populated
    const seller = await Seller.findById(id)
      .populate("interestedUsers.userId", "name email") // Populate interested user details
      .populate("interestedUsers.productId", "name price") // Populate interested product details
      .populate("products", "name price categoryId"); // Populate seller products

    if (!seller) {
      return res.status(404).json({ error: "Seller not found." });
    }

    // Format the response (optional)
    const formattedSeller = {
      id: seller._id,
      name: seller.name,
      email: seller.email,
      mobile: seller.mobile,
      gstNumber: seller.gstNumber,
      companyName: seller.companyName,
      pan: seller.pan,
      role: seller.role,
      isVerified: seller.isVerified,
      isBlocked: seller.isBlocked,
      address: seller.address,
      products: seller.products.map((product) => ({
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
        productCategory: product.categoryId,
      })),
      interestedUsers: seller.interestedUsers.map((interest) => ({
        userId: interest.userId?._id || "N/A",
        userName: interest.userId?.name || "N/A",
        userEmail: interest.userId?.email || "N/A",
        productId: interest.productId?._id || "N/A",
        productName: interest.productId?.name || "N/A",
        productPrice: interest.productId?.price || "N/A",
        date: interest.date,
      })),
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    };

    res.status(200).json(formattedSeller);
  } catch (error) {
    console.error("Error fetching seller:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching the seller.",
    });
  }
});

// Controller to fetch all wishlists
const getAllWishlists = asyncHandler(async (req, res) => {
  try {
    // Fetch all wishlists with populated user and product details
    const wishlists = await Wishlist.find({})
      .populate("userId", "name email") // Populate user details
      .populate("items.productId", "name price categoryId"); // Populate product details

    // Format the response (optional)
    const formattedWishlists = wishlists.map((wishlist) => ({
      id: wishlist._id,
      user: {
        userId: wishlist.userId?._id || "N/A",
        userName: wishlist.userId?.name || "N/A",
        userEmail: wishlist.userId?.email || "N/A",
      },
      items: wishlist.items.map((item) => ({
        productId: item.productId?._id || "N/A",
        productName: item.productId?.name || "N/A",
        productPrice: item.productId?.price || "N/A",
        productCategory: item.productId?.categoryId || "N/A",
      })),
      createdAt: wishlist.createdAt,
    }));

    res.status(200).json(formattedWishlists);
  } catch (error) {
    console.error("Error fetching wishlist data:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching wishlist data.",
    });
  }
});


// Controller to fetch a specific wishlist by user ID
const getWishlistByUserId = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the wishlist for a specific user
    const wishlist = await Wishlist.findOne({ userId })
      .populate("userId", "name email") // Populate user details
      .populate("items.productId", "name price categoryId"); // Populate product details

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found for this user." });
    }

    // Format the response (optional)
    const formattedWishlist = {
      id: wishlist._id,
      user: {
        userId: wishlist.userId?._id || "N/A",
        userName: wishlist.userId?.name || "N/A",
        userEmail: wishlist.userId?.email || "N/A",
      },
      items: wishlist.items.map((item) => ({
        productId: item.productId?._id || "N/A",
        productName: item.productId?.name || "N/A",
        productPrice: item.productId?.price || "N/A",
        productCategory: item.productId?.categoryId || "N/A",
      })),
      createdAt: wishlist.createdAt,
    };

    res.status(200).json(formattedWishlist);
  } catch (error) {
    console.error("Error fetching wishlist data:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching wishlist data.",
    });
  }
});

module.exports = {
  getOrderSummary,
  getPendingOrders,
  getConfirmedOrders,
  getCancelledOrders,
  getDeliveredOrders,
  getShippedOrders,
  getUsersdata,
  getAllAddresses,
  getAdminData,
  getCartData,
  getCategoryData,
  getSubcategoryData,
  getDeliveryChargesData,
  getInterestedUserData,
  getOtherPaymentData,
  getOrderData,
  getOrderTrackingData,
  getProductPaymentData,
  getAllSellerProductVisibility,
  getSellersdata,
  getSellerById,
  getAllWishlists,
  getWishlistByUserId
};
