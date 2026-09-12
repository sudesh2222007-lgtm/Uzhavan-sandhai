const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

    quantity: { type: Number, required: true, min: 1 },
    unitPriceAtOrder: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    deliveryType: { type: String, enum: ["home_delivery", "farm_pickup"], required: true },
    deliveryAddress: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "out_for_delivery", "completed", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, enum: ["cod", "upi"], default: "cod" },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },

    customerNote: { type: String, default: "" },
    farmerResponseNote: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
