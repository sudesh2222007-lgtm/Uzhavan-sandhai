const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  setProductStatus,
  getProducts,
  getProductById,
  getMyProducts,
  getNearbyFarmers,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getProducts);
router.get("/nearby-farmers", getNearbyFarmers);
router.get("/mine", protect, authorize("farmer"), getMyProducts);
router.get("/:id", getProductById);

router.post("/", protect, authorize("farmer"), upload.array("images", 5), createProduct);
router.put("/:id", protect, authorize("farmer"), upload.array("images", 5), updateProduct);
router.patch("/:id/status", protect, authorize("farmer"), setProductStatus);
router.delete("/:id", protect, authorize("farmer"), deleteProduct);

module.exports = router;
