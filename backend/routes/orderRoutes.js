const express = require("express");
const router = express.Router();
const {
  placeOrder,
  respondToOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
  getFarmerOrders,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("customer"), placeOrder);
router.get("/mine", protect, authorize("customer"), getMyOrders);
router.patch("/:id/cancel", protect, authorize("customer"), cancelOrder);

router.get("/farmer", protect, authorize("farmer"), getFarmerOrders);
router.patch("/:id/respond", protect, authorize("farmer"), respondToOrder);
router.patch("/:id/status", protect, authorize("farmer"), updateOrderStatus);

module.exports = router;
