const express = require('express');
const { addToWishlist, getWishlist, deleteWishlist , removeFromWishlist } = require('../controller/wishlistCtrl');

const router = express.Router();

router.post('/add',addToWishlist);
router.get('/get-wishlist/:userId',getWishlist);
router.delete('/delete/:userId',deleteWishlist);
router.post('/remove', removeFromWishlist);  

module.exports = router;