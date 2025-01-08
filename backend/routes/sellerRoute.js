const express = require("express");
const router = express.Router();
const {
  forgotPasswordToken,
  resetPassword,
  updatePassword,
  loginSellerCtrl,
  getAllSellers,
  handleRefreshToken,
  logout,
  deleteSeller,
  createSeller,
  verifyOtp,
  updateProduct,
  deleteProduct,
  getAllProducts,
  CreateProduct,
  updateSeller,
  createProductWithVisibility,
  updateProductVisibility,
  getSimilarProducts,
  getProductDetails,
  getSellerDetailsById,
  getProductsForBox2,
  getInterestedUsers,
  removeInterestedUser,
  getProductWithIncompletePayments,
} = require("../controller/sellerCtrl");
const {
  isAdmin,
  authSellerMiddleware,
  authAdminMiddleware,
} = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");
const {  getSellerSalesStats, getMonthlySales, getMonthlySalesBySeller, checkLowStock } = require("../controller/SalesController");
const { sendInvoiceEmail } = require("../controller/sendInvoiceEmail");
const { getSellerDetails } = require("../controllers/sellerController");
// Sample controller function (replace this with your actual logic)
/*const createseller = (req, res) => {
    res.status(201).json({ message: "Seller created" });
}; */

// Define your role routes here
router.post("/register", createSeller);
// This sets up a POST /api/role route
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password", resetPassword);
router.put("/password", authSellerMiddleware, updatePassword);
router.post("/login", loginSellerCtrl);
router.post("/logout", logout);
router.get("/all-seller", authAdminMiddleware, getAllSellers); // Require auth and admin for all users
router.get("/logout", logout);
router.get("/refresh-token", handleRefreshToken);
router.put("/update-seller/:id", authSellerMiddleware, updatePassword); // Update user route
router.get("/seller/:id", getSellerDetails);
//------------product route---------------
// For seller-specific routes, only use authSellerMiddleware
router.post(
  "/sell-product",
  authSellerMiddleware,
  upload.array("files", 5),
  CreateProduct
);
router.get("/get-all-products", authSellerMiddleware, getAllProducts);
router.get("/incomplete-payment-products",authSellerMiddleware,getProductWithIncompletePayments)
router.put(
  "/update-product/:id",
  authSellerMiddleware,
  upload.single("file"),
  updateProduct
);
router.delete("/delete-product/:id", authSellerMiddleware, deleteProduct);
router.get("/details/:id", getProductDetails);
router.get("/products/box2", getProductsForBox2);

router.put(
  "/update-product/:id",
  authSellerMiddleware,
  upload.single("file"),
  updateProduct
);

router.get("/interested-users", authSellerMiddleware, getInterestedUsers);
// need seller id
router.delete(
  "/remove-interested-user",
  authSellerMiddleware,
  removeInterestedUser
);

router.put("/updateSeller/:id", updateSeller);
// For admin/user-specific routes, use authUserMiddleware and isAdmin where needed
router.get("/all-seller", authAdminMiddleware, getAllSellers);
router.get("/seller-by-id/:id", getSellerDetailsById);
//sk
// Mixed routes with admin permissions and seller access
router.put("/update-seller/:id", authAdminMiddleware, updatePassword);
router.delete("/delete-seller/:id", authAdminMiddleware, deleteSeller);

// Visibility Route
router.post(
  "/create-visibility-product",
  authSellerMiddleware,
  createProductWithVisibility
);
router.put(
  "/update--visibility-product",
  authSellerMiddleware,
  updateProductVisibility
);

// visibility product logic
//router.post('/sell-product', authSellerMiddleware, upload.single('image'), createProductWithVisibility);
router.get("/get-similar-products", getSimilarProducts);



//-------------seller for the seller -----sales and income----------
router.get("/sales/income/:sellerId", getSellerSalesStats);
router.post("/monthly-sales/:sellerId", getMonthlySalesBySeller);

// ---------seller check stock-------
router.get("/check-stock/:sellerId/:requestedStock",checkLowStock)

// Route to get total products sold for a seller

//-----send email for invoice while creating product
router.post("/send-invoice-email", sendInvoiceEmail);

module.exports = router;
