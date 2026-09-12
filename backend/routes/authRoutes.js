const express = require("express");
const router = express.Router();
const { requestOtp, registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/send-otp", requestOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;
