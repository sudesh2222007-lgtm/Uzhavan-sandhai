const mongoose = require("mongoose");

// Daily market/mandi price reference shown in the Farmer Information Center.
// Admin can update these; frontend also uses this as an AI-price-suggestion baseline.
const marketPriceSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    avgPrice: { type: Number, required: true },
    unit: { type: String, default: "kg" },
    market: { type: String, default: "Local Mandi" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MarketPrice", marketPriceSchema);
