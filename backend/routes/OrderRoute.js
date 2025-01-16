const express = require("express");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getSellerOrders,
} = require("../controller/OrderCtrl");
const {
  authUserMiddleware,
  authSellerMiddleware,
  authAdminMiddleware,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create-order", authUserMiddleware, createOrder);
router.get("/get-user-order/:id",authAdminMiddleware, getUserOrders); //get all orders for user

// Ensure this is in your orderRoutes.js file
router.get("/seller-order", authSellerMiddleware, getSellerOrders);

router.get("/:id", getOrderById); //get order by id
router.put("/:id/status", updateOrderStatus); //get order by id

module.exports = router;
