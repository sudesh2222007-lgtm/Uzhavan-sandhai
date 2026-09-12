const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Update logged-in user's own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const allowedFields = ["name", "village", "farmLocation", "currentLocation", "profileImage"];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  await user.save();
  res.status(200).json({ success: true, user });
});

// @desc    Add/remove a farmer from the customer's favourites
// @route   PATCH /api/users/favourites/:farmerId
// @access  Private/Customer
const toggleFavouriteFarmer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { farmerId } = req.params;

  const alreadyFav = user.favouriteFarmers.some((id) => id.toString() === farmerId);
  if (alreadyFav) {
    user.favouriteFarmers = user.favouriteFarmers.filter((id) => id.toString() !== farmerId);
  } else {
    user.favouriteFarmers.push(farmerId);
  }

  await user.save();
  res.status(200).json({ success: true, favouriteFarmers: user.favouriteFarmers });
});

// @desc    Get a public farmer profile
// @route   GET /api/users/farmer/:id
// @access  Public
const getFarmerProfile = asyncHandler(async (req, res) => {
  const farmer = await User.findOne({ _id: req.params.id, role: "farmer" }).select(
    "name village farmLocation profileImage phone createdAt"
  );
  if (!farmer) {
    res.status(404);
    throw new Error("Farmer not found");
  }
  res.status(200).json({ success: true, farmer });
});

module.exports = { updateProfile, toggleFavouriteFarmer, getFarmerProfile };
