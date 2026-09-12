const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Product = require("../models/Product");

// @desc    Add a review for a farmer/product (customer)
// @route   POST /api/reviews
// @access  Private/Customer
const addReview = asyncHandler(async (req, res) => {
  const { farmerId, productId, orderId, rating, comment } = req.body;

  const review = await Review.create({
    customer: req.user._id,
    farmer: farmerId,
    product: productId,
    order: orderId,
    rating,
    comment,
  });

  if (productId) {
    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await Product.findByIdAndUpdate(productId, {
        ratingAverage: Math.round(stats[0].avg * 10) / 10,
        ratingCount: stats[0].count,
      });
    }
  }

  res.status(201).json({ success: true, review });
});

// @desc    Get reviews for a farmer
// @route   GET /api/reviews/farmer/:farmerId
// @access  Public
const getFarmerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ farmer: req.params.farmerId })
    .populate("customer", "name")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("customer", "name")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: reviews.length, reviews });
});

module.exports = { addReview, getFarmerReviews, getProductReviews };
