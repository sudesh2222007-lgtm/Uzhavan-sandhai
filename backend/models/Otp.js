const mongoose = require("mongoose");

// Short-lived OTP codes for phone verification (login/register).
// Documents auto-delete 5 minutes after creation via the TTL index below.
const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // 300s = 5 min TTL
});

module.exports = mongoose.model("Otp", otpSchema);
