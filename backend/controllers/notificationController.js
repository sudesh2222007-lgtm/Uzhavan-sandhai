const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

// @desc    Get logged-in user's notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: notifications.length, notifications });
});

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  res.status(200).json({ success: true, notification });
});

module.exports = { getMyNotifications, markAsRead };
