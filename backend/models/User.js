const mongoose = require("mongoose");

// Single User model shared by farmer/customer/admin roles (role field decides behaviour).
// Authentication is phone + OTP only (no password) - see models/Otp.js and utils/otp.js.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"],
    },
    role: { type: String, enum: ["farmer", "customer", "admin"], required: true },

    // Farmer-only fields
    village: { type: String, trim: true },
    farmLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isApproved: { type: Boolean, default: function () { return this.role !== "farmer"; } },

    // Customer-only fields
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    favouriteFarmers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Shared
    profileImage: { type: String, default: "" },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
