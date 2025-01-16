const express = require('express');
const {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    getProductCounts
} = require('../controller/productCtrl');

const router = express.Router();
const { isAdmin, authUserMiddleware, authSellerMiddleware, authAdminMiddleware } = require('../middlewares/authMiddleware');

// Public routes for users
router.put('/wishlist', authUserMiddleware, addToWishlist); // No admin check here
router.put('/rating', authUserMiddleware, rating); // No admin check here

// Admin routes for product management
router.post("/", authSellerMiddleware, createProduct);
router.get("/counts", getProductCounts); // No ID is required

router.get("/:id",  getProduct);
router.get('/', getAllProduct);
router.put('/:id', authUserMiddleware, updateProduct);
router.delete('/:id', authUserMiddleware,  deleteProduct);


router.get("/counts", getProductCounts); // No ID is required


module.exports = router;
