const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const review = new Review({ productId, userId: req.user._id, rating, comment });
  await review.save();
  res.status(201).json(review);
};

exports.getProductReviews = async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId }).populate('userId');
  res.json(reviews);
};
