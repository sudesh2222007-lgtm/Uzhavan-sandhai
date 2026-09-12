const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
