const express = require('express');
const { createReview, getProductReviews } = require('../controllers/reviewController');
const { updateOrderStatus } = require('../controller/OrderCtrl');
const router = express.Router();

router.post('/create', createReview);
router.get('/:productId', getProductReviews);
router.put('/update-status', updateOrderStatus);


module.exports = router;
