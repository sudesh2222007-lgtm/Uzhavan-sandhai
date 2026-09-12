const express = require("express");
const router = express.Router();
const {
  getMarketPrices,
  addMarketPrice,
  getNews,
  addNews,
  getSchemes,
  addScheme,
  getWeather,
} = require("../controllers/infoController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/market-prices", getMarketPrices);
router.post("/market-prices", protect, authorize("admin"), addMarketPrice);

router.get("/news", getNews);
router.post("/news", protect, authorize("admin"), addNews);

router.get("/schemes", getSchemes);
router.post("/schemes", protect, authorize("admin"), addScheme);

router.get("/weather", getWeather);

module.exports = router;
