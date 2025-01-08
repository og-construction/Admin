const express = require('express');
const { addToCart, getCart, deleteCart, getAllCarts, deleteSpecificCart, checkoutCart, removeItemFromCart } = require('../controller/CartCtrl');

const router = express.Router();


router.post('/add-to-cart', addToCart);
router.get('/get-cart/:userId', getCart)
router.delete('/delete/:userId', deleteCart); // Fix route to include ":userId"
router.get('/get-all-carts/:id',getAllCarts)
//router.delete('/delete',deleteSpecificCart)
router.post('/checkout',checkoutCart)
router.post('/remove-item',removeItemFromCart)
module.exports = router;