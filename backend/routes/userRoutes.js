const express = require("express");
const router = express.Router();
const { updateProfile, toggleFavouriteFarmer, getFarmerProfile } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.put("/profile", protect, updateProfile);
router.patch("/favourites/:farmerId", protect, authorize("customer"), toggleFavouriteFarmer);
router.get("/farmer/:id", getFarmerProfile);

module.exports = router;
