const express = require("express");
const {
  initiatePayment,
  handlePaymentResponse,
  createpaymentorder,
  paymentstoretodb,
  StoresellerPayment,
  initiateVisibilityPayment,
  verifyVisibilityPayment,
  calculateVisibilityCharges,
  handleProductCreation,
  getSellerBillingHistory,
  getSellerIncome,
  storesellervisibilityPayment,
  initiateDepositPayment,
  verifyDepositPayment,
  storeDepositPayment,
  getAllSales,
  initiateMultiplePayments,
  verifyMultiplePayments,
  storeMultiplePayments,
} = require("../controller/paymentCtrl");
const { authSellerMiddleware } = require("../middlewares/authMiddleware");
const { createOtherPayment } = require("../controller/otherpayment");
const router = express.Router();

router.post("/initiate", initiatePayment);
router.post("/response", handlePaymentResponse);
router.post("/create-payment-order", createpaymentorder);
// produc payment routes
router.post("/payment-store-todb", paymentstoretodb);
// seller registrataion payment routes
router.post("/seller-payment-store-todb", StoresellerPayment);
// seller visibility payment store-todb
router.post(
  "/seller-visibility-payment-store-todb",
  storesellervisibilityPayment
);
//
router.post("/initiate-visibility-payment", initiateVisibilityPayment);

router.post("/verify-visibility-payment", verifyVisibilityPayment);
router.post("/handle-visibility-product", handleProductCreation);

//----------------bilig history and transactions
router.get(
  "/billing-history/:id",
  authSellerMiddleware,
  getSellerBillingHistory
),
  router.get("/seller-income/:id", getSellerIncome);

router.post("/visibility-charge", (req, res) => {
  try {
    const { price, maxquantity, visibilityLevel } = req.body;

    if (!price || !maxquantity || !visibilityLevel) {
      return res.status(400).json({
        message: "Price, max quantity, and visibility level are required",
      });
    }

    const charges = calculateVisibilityCharges(
      price,
      maxquantity,
      visibilityLevel
    );
    res.status(200).json({ charges });
  } catch (error) {
    console.error("Error calculating visibility charges:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post("/initiate-deposit-payment", initiateDepositPayment);
router.post("/verify-deposit-payment", verifyDepositPayment);
router.post("/store-deposit-payment", storeDepositPayment);
router.get("/get-all-sales", getAllSales);
//router.post("/initiate-multiple-payments",initiateMultiplePayments)

//router.post("/verify-multiple-payments", verifyMultiplePayments);
//router.post("/store-multiple-payments", storeMultiplePayments);


router.post('/other-payment',createOtherPayment)



module.exports = router;
