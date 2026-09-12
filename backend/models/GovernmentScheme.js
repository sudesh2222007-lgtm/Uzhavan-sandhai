const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    eligibility: { type: String, default: "" },
    applyLink: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GovernmentScheme", schemeSchema);
