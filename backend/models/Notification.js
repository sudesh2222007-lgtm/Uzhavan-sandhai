const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["order", "product", "system", "price_alert"],
      default: "system",
    },
    isRead: { type: Boolean, default: false },
    relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    relatedProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
