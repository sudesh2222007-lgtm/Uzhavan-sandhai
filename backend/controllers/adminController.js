const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc    List farmers pending approval
// @route   GET /api/admin/farmers/pending
// @access  Private/Admin
const getPendingFarmers = asyncHandler(async (req, res) => {
  const farmers = await User.find({ role: "farmer", isApproved: false });
  res.status(200).json({ success: true, farmers });
});

// @desc    Approve a farmer
// @route   PATCH /api/admin/farmers/:id/approve
// @access  Private/Admin
const approveFarmer = asyncHandler(async (req, res) => {
  const farmer = await User.findOneAndUpdate(
    { _id: req.params.id, role: "farmer" },
    { isApproved: true },
    { new: true }
  );
  if (!farmer) {
    res.status(404);
    throw new Error("Farmer not found");
  }
  res.status(200).json({ success: true, farmer });
});

// @desc    List all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: "customer" });
  res.status(200).json({ success: true, count: customers.length, customers });
});

// @desc    Deactivate/reactivate any user
// @route   PATCH /api/admin/users/:id/toggle-active
// @access  Private/Admin
const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.isActive = !user.isActive;
  await user.save();
  res.status(200).json({ success: true, user });
});

// @desc    Remove a fake/inappropriate product listing
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ success: true, message: "Listing removed" });
});

// @desc    Dashboard analytics summary
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const [totalFarmers, totalCustomers, totalProducts, totalOrders, pendingFarmers, revenueAgg] =
    await Promise.all([
      User.countDocuments({ role: "farmer" }),
      User.countDocuments({ role: "customer" }),
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "farmer", isApproved: false }),
      Order.aggregate([
        { $match: { status: { $in: ["accepted", "completed", "out_for_delivery"] } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalFarmers,
      totalCustomers,
      totalProducts,
      totalOrders,
      pendingFarmers,
      totalRevenue: revenueAgg[0]?.total || 0,
    },
  });
});

module.exports = {
  getPendingFarmers,
  approveFarmer,
  getCustomers,
  toggleUserActive,
  removeProduct,
  getAnalytics,
};
