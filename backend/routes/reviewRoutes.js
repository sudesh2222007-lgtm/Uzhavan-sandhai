const express = require("express");
const router = express.Router();
const { addReview, getFarmerReviews, getProductReviews } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("customer"), addReview);
router.get("/farmer/:farmerId", getFarmerReviews);
router.get("/product/:productId", getProductReviews);

module.exports = router;
