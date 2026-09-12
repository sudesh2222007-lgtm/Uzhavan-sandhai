const express = require("express");
const router = express.Router();
const {
  getPendingFarmers,
  approveFarmer,
  getCustomers,
  toggleUserActive,
  removeProduct,
  getAnalytics,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin")); // every route below requires an admin

router.get("/farmers/pending", getPendingFarmers);
router.patch("/farmers/:id/approve", approveFarmer);
router.get("/customers", getCustomers);
router.patch("/users/:id/toggle-active", toggleUserActive);
router.delete("/products/:id", removeProduct);
router.get("/analytics", getAnalytics);

module.exports = router;
