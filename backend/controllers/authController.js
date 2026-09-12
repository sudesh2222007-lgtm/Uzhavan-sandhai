const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Otp = require("../models/Otp");
const generateToken = require("../utils/generateToken");
const { generateOtpCode, sendOtp } = require("../utils/otp");

// @desc    Send OTP to a phone number (works for both register and login)
// @route   POST /api/auth/send-otp
// @access  Public
const requestOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    res.status(400);
    throw new Error("Enter a valid 10-digit phone number");
  }

  await Otp.deleteMany({ phone }); // clear any older OTPs for this number
  const code = generateOtpCode();
  await Otp.create({ phone, code });
  const result = await sendOtp(phone, code);

  res.status(200).json({
    success: true,
    message: result.devMode ? "OTP generated (dev mode)" : "OTP sent to your mobile via SMS",
    devMode: !!result.devMode,
    ...(result.devMode ? { devOtp: code } : {}),
  });
});

// @desc    Register a new user after OTP verification
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, phone, otp, role, village, farmLocation, currentLocation } = req.body;

  if (!name || !phone || !otp || !role) {
    res.status(400);
    throw new Error("Name, phone, OTP and role are required");
  }

  const validOtp = await Otp.findOne({ phone, code: otp });
  if (!validOtp) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this phone number already exists. Please login instead.");
  }

  const userData = { name, phone, role, isPhoneVerified: true };
  if (role === "farmer") {
    userData.village = village;
    userData.farmLocation = farmLocation;
  }
  if (role === "customer") {
    userData.currentLocation = currentLocation;
  }

  const user = await User.create(userData);
  await Otp.deleteMany({ phone });

  res.status(201).json({
    success: true,
    token: generateToken(user._id, user.role),
    user,
  });
});

// @desc    Login an existing user after OTP verification
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    res.status(400);
    throw new Error("Phone number and OTP are required");
  }

  const validOtp = await Otp.findOne({ phone, code: otp });
  if (!validOtp) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  const user = await User.findOne({ phone });
  if (!user) {
    res.status(404);
    throw new Error("No account found for this phone number. Please register first.");
  }

  await Otp.deleteMany({ phone });

  res.status(200).json({
    success: true,
    token: generateToken(user._id, user.role),
    user,
  });
});

// @desc    Get logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = { requestOtp, registerUser, loginUser, getMe };
