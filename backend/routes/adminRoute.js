const express = require('express');
const { countLoggedInUsers, createAdmin, loginAdmin, getAllAdmin, getaAdmin, deleteAdmin, blockAdmin, unblockAdmin, verifyOtp, updatePassword, resetPassword, handleRefreshToken, generateRefreshToken, getSellerMetrics, getEarningsData, updateAdmin, getSellerPaymentAndProductDetails, getSellerDetailsWithPayments, getDetailsByProductId } = require('../controller/adminCtrl');
const upload = require('../middlewares/multer');

const {
    getAllUsers,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser,
    getUserDetailsById,
    getUserDetails,
} = require('../controller/userCtrl'); // Import the user controller functions
const {  isAdmin, authUserMiddleware, authAdminMiddleware } = require('../middlewares/authMiddleware');
const { approveProduct, deleteSeller, blockSeller, unblockSeller, getSellerDetails, getProductsBySubcategoryId, deleteProduct, updateProduct, getAllInterestedUsersForAdmin } = require('../controller/sellerCtrl');
const { getOrderSummary, getPendingOrders, getConfirmedOrders, getShippedOrders, getCancelledOrders, getDeliveredOrders, getUsersdata, getAllAddresses, getAdminData, getCartData, getCategoryData, getSubcategoryData, getDeliveryChargesData, getInterestedUserData, getOtherPaymentData, getOrderData, getOrderTrackingData, getProductPaymentData, getAllSellerProductVisibility, getSellersdata, getSellerById, getAllWishlists, getWishlistByUserId } = require('../controller/adminorderCtrl');
const { getAllOrders } = require('../controller/OrderCtrl');

const router = express.Router();

// Define the routes
router.get('/user/details',getUserDetails)
router.get('/user/all-users',getAllUsers); // Get all users
router.put('/user/update/:id',authAdminMiddleware,  updateUser); // Update user
router.delete('/user/delete/:id', authAdminMiddleware,deleteUser); // Delete user
router.put('/user/block/:id', authAdminMiddleware, blockUser); // Block user
router.get('/user/details/:id', authAdminMiddleware,  getUserDetailsById); //sk
router.put('/user/unblock/:id', authAdminMiddleware, unblockUser); // Unblock user
router.get('/totalUsers', countLoggedInUsers); // Count logged-in users
router.post('/create-admin',createAdmin)//-----------create admin
router.post('/login',loginAdmin)//---------------login
router.get('/get-all-admin',getAllAdmin)
router.get('/get-admin/:id',getaAdmin)
router.put('/update-admin/:id',updateAdmin)
router.delete('/delete-admin/:id',deleteAdmin)
router.put('/block-admin/:id',blockAdmin);
router.put('/unblock-admin/:id',unblockAdmin);
router.post('/verify-otp',verifyOtp)
router.put('/update-password',updatePassword)
router.put('/reset-password',resetPassword)
router.post('/handle-refresh-token',handleRefreshToken)
router.post('/generate-refresh-token',generateRefreshToken)

//-----------seller
router.put('/update-seller/:id', authAdminMiddleware, updatePassword); // Update user route
router.delete('/delete-seller/:id', authAdminMiddleware, deleteSeller); // Delete user route
router.put("/block-seller/:id", authAdminMiddleware, blockSeller);
router.put("/unblock-seller/:id", authAdminMiddleware, unblockSeller);
router.get('/seller-details/:id', authAdminMiddleware, getSellerDetails);


//---------------Product Route-------------------
router.put('/approve-product/:id', authAdminMiddleware, approveProduct);
router.get('/subcategory/:subcategoryId',getProductsBySubcategoryId)
router.put('/update-product/:id',authAdminMiddleware,upload.single('file'),updateProduct)
router.delete('/delete-product/:id', authAdminMiddleware, deleteProduct);


//--------------get seller details product details and payment details ------------
router.get('/payment-details/:productId', getSellerPaymentAndProductDetails);

router.get('/registration/payment/:sellerId',getSellerDetailsWithPayments)
router.get("/details/:productId", getDetailsByProductId)

//------------order status----------------------
router.get('/order-summary', getOrderSummary); // Get order summary by status
router.get("/orders/pending", getPendingOrders);
router.get("/orders/confirmed", getConfirmedOrders);
router.get("/orders/shipped", getShippedOrders);
router.get("/orders/cancelled", getCancelledOrders);
router.get("/orders/delivered", getDeliveredOrders);

//-------------all interested users
router.get('/interested-users',authAdminMiddleware,getAllInterestedUsersForAdmin)
//-get all orders---------------
router.get('/orders', getAllOrders);
//-----------sellers for graph-----------
router.get('/seller-metrics', authAdminMiddleware, getSellerMetrics);
router.get("/earnings", getEarningsData);



//-----------------data all----------------
router.get('/all-users', getUsersdata);
router.get("/addresses", getAllAddresses);
router.get("/admins", getAdminData);
router.get("/carts", getCartData);
router.get("/categories", getCategoryData);
router.get("/subcategories", getSubcategoryData);
router.get("/delivery-charges", getDeliveryChargesData);
router.get("/userInterested", getInterestedUserData);
router.get("/otherPayment", getOtherPaymentData);
router.get("/order", getOrderData);
router.get("/orderTracking",getOrderTrackingData)
router.get("/product-payments", getProductPaymentData);
router.get("/sellerPayment", getAllSellerProductVisibility); // Define the route
router.get("/sellers", getSellersdata); // Route to get all sellers
router.get("/sellers/:id", getSellerById); // Route to get a single seller by ID
router.get("/wishlists", getAllWishlists);
router.get("/wishlists/:userId", getWishlistByUserId);



module.exports = router;
