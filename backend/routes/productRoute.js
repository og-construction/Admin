const express = require('express');
const {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating
} = require('../controller/productCtrl');

const router = express.Router();
const { isAdmin, authUserMiddleware, authSellerMiddleware } = require('../middlewares/authMiddleware');

// Public routes for users
router.put('/wishlist', authUserMiddleware, addToWishlist); // No admin check here
router.put('/rating', authUserMiddleware, rating); // No admin check here

// Admin routes for product management
router.post("/", authSellerMiddleware, createProduct);
router.get("/:id", getProduct);
router.get('/', getAllProduct);
router.put('/:id', authUserMiddleware, updateProduct);
router.delete('/:id', authUserMiddleware,  deleteProduct);

module.exports = router;
