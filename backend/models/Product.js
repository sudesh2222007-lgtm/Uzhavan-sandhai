const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["காய்கறி", "பழம்", "தானியம்", "பால் பொருள்", "மற்றவை"], // Vegetable/Fruit/Grain/Dairy/Other
    },
    images: [{ type: String }], // Cloudinary URLs or local /uploads paths

    price: { type: Number, required: true, min: 0 },
    quantityAvailable: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ["kg", "g", "dozen", "litre", "piece"], default: "kg" },

    harvestDate: { type: Date, required: true },
    isOrganic: { type: Boolean, default: false },
    description: { type: String, trim: true },

    // Seasonal info
    season: {
      type: String,
      enum: ["கோடை", "மழைக்காலம்", "குளிர்காலம்", "ஆண்டு முழுவதும்"], // Summer/Monsoon/Winter/Year-round
      default: "ஆண்டு முழுவதும்",
    },
    isSeasonalPick: { type: Boolean, default: false },

    // Delivery info
    homeDeliveryAvailable: { type: Boolean, default: false },
    farmPickupAvailable: { type: Boolean, default: true },
    deliveryCharge: { type: Number, default: 0 },
    estimatedDeliveryTime: { type: String, default: "" }, // e.g. "Same day", "Within 24 hours"
    deliveryCoverageKm: { type: Number, default: 10 },
    preferredPickupTime: { type: String, default: "" },

    status: { type: String, enum: ["available", "sold_out"], default: "available" },

    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

// A product is "fresh today" if harvested within the last 24 hours.
productSchema.virtual("isFreshToday").get(function () {
  if (!this.harvestDate) return false;
  const diffHours = (Date.now() - new Date(this.harvestDate).getTime()) / 36e5;
  return diffHours <= 24;
});
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
