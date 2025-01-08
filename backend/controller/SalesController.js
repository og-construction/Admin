const { default: mongoose } = require("mongoose");
const Sale = require("../models/SaleSchema");
const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");

// Get separate total products sold and total income for a seller
const getSellerSalesStats = asyncHandler(async (req, res) => {
  const { sellerId } = req.params; // Seller ID passed as a URL parameter

  if (!sellerId) {
    return res.status(400).json({ message: "Seller ID is required" });
  }

  try {
    // Fetch all sales for the seller
    const sales = await Sale.find({ sellerId });

    if (!sales || sales.length === 0) {
      res.status(200).json({
        sellerId,
        totalProductsSold: 0,
        totalIncome: 0,
      });
      return;
    }

    // Separate total products sold and total income
    let totalProductsSold = 0;
    let totalIncome = 0;

    sales.forEach((sale) => {
      totalProductsSold += sale.quantity; // Sum up all quantities
      totalIncome += sale.total; // Sum up total income
    });

    // Send separate response
    res.status(200).json({
      sellerId,
      totalProductsSold,
      totalIncome,
    });
  } catch (error) {
    console.error("Error fetching sales stats:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch sales stats", error: error.message });
  }
});

const dayjs = require("dayjs"); // Import Day.js

// get monthly sales
const getMonthlySalesBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    // Parse and adjust dates using Day.js
    const start = dayjs(startDate).startOf("month"); // Start of the month
    const end = dayjs(endDate).endOf("month"); // End of the month, includes full day

    const sellerIdObject = new mongoose.Types.ObjectId(sellerId);

    // Aggregation pipeline
    const salesData = await Sale.aggregate([
      {
        $match: {
          sellerId: sellerIdObject,
          createdAt: { $gte: start.toDate(), $lte: end.toDate() },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: "$price" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
    // Generate months for the full range
    const months = [];
    let current = start.clone(); // Start of the first month
    const lastMonth = end.clone(); // Start of the last month

    while (current.isBefore(lastMonth) || current.isSame(lastMonth, "month")) {
      months.push({
        year: current.year(),
        month: current.month() + 1, // 1-indexed (January is 1)
        totalSales: 0, // Default totalSales
      });
      current = current.add(1, "month"); // Move to the next month
    }

    // Map sales data into a dictionary for lookup
    const salesMap = new Map(
      salesData.map((data) => [
        `${data._id.year}-${data._id.month}`,
        data.totalSales,
      ])
    );

    // Update months with actual sales data
    const formattedSalesData = months.map((month) => ({
      year: month.year,
      month: month.month,
      totalSales: salesMap.get(`${month.year}-${month.month}`) || 0,
    }));

    res.json({ sellerId, sales: formattedSalesData });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to check for low stock, now taking req and res as parameters
const checkLowStock = async (req, res) => {
  const { sellerId, requestedStock } = req.params; // Get sellerId and requestedStock from the URL parameters

  try {
    // Fetch products for the specific seller
    const products = await productModel.find({ seller: sellerId });

    // Filter products where stock is less than the requested stock
    const lowStockProducts = products.filter(
      (product) => product.stock < parseInt(requestedStock)
    );

    if (lowStockProducts.length > 0) {
      return res.status(200).json({
        message: "Low stock alert",
        products: lowStockProducts,
      });
    } else {
      return res.status(200).json({
        message: "Stock is sufficient",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getSellerSalesStats,
  getMonthlySalesBySeller,
  checkLowStock,
};
