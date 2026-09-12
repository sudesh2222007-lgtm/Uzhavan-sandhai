const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const User = require("../models/User");
const { getDistanceKm } = require("../utils/distance");

// @desc    Create a new product (farmer only)
// @route   POST /api/products
// @access  Private/Farmer
const createProduct = asyncHandler(async (req, res) => {
  const images = (req.files || []).map((f) => `/uploads/${f.filename}`);

  const product = await Product.create({
    ...req.body,
    farmer: req.user._id,
    images,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update a product (owner farmer only)
// @route   PUT /api/products/:id
// @access  Private/Farmer
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only edit your own products");
  }

  const newImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
  Object.assign(product, req.body);
  if (newImages.length) product.images = [...product.images, ...newImages];

  await product.save();
  res.status(200).json({ success: true, product });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Farmer
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only delete your own products");
  }
  await product.deleteOne();
  res.status(200).json({ success: true, message: "Product deleted" });
});

// @desc    Mark product sold out / available
// @route   PATCH /api/products/:id/status
// @access  Private/Farmer
const setProductStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only update your own products");
  }
  product.status = req.body.status === "sold_out" ? "sold_out" : "available";
  await product.save();
  res.status(200).json({ success: true, product });
});

// @desc    Get all products with search / filter / geolocation sort
// @route   GET /api/products
// @query   search, category, minPrice, maxPrice, organic, seasonal, lat, lng, radiusKm
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, organic, seasonal, lat, lng, radiusKm, farmerId } = req.query;

  const filter = { status: "available" };
  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (farmerId) filter.farmer = farmerId;
  if (organic === "true") filter.isOrganic = true;
  if (seasonal === "true") filter.isSeasonalPick = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let products = await Product.find(filter).populate("farmer", "name village farmLocation phone").sort({ createdAt: -1 });

  // Attach distance + optional radius filter when customer GPS is supplied
  if (lat && lng) {
    products = products
      .map((p) => {
        const obj = p.toObject();
        obj.distanceKm = p.farmer?.farmLocation
          ? getDistanceKm(Number(lat), Number(lng), p.farmer.farmLocation.lat, p.farmer.farmLocation.lng)
          : null;
        return obj;
      })
      .filter((p) => (radiusKm ? p.distanceKm === null || p.distanceKm <= Number(radiusKm) : true))
      .sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
  }

  res.status(200).json({ success: true, count: products.length, products });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "farmer",
    "name village farmLocation phone profileImage"
  );
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ success: true, product });
});

// @desc    Get all products belonging to the logged-in farmer
// @route   GET /api/products/mine
// @access  Private/Farmer
const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ farmer: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: products.length, products });
});

// @desc    Get nearby farmers (distinct users) within a radius
// @route   GET /api/products/nearby-farmers?lat=&lng=&radiusKm=
// @access  Public
const getNearbyFarmers = asyncHandler(async (req, res) => {
  const { lat, lng, radiusKm } = req.query;
  if (!lat || !lng) {
    res.status(400);
    throw new Error("lat and lng are required");
  }

  const farmers = await User.find({ role: "farmer", isApproved: true });
  const withDistance = farmers
    .map((f) => ({
      ...f.toObject(),
      distanceKm: f.farmLocation ? getDistanceKm(Number(lat), Number(lng), f.farmLocation.lat, f.farmLocation.lng) : null,
    }))
    .filter((f) => (radiusKm ? f.distanceKm !== null && f.distanceKm <= Number(radiusKm) : true))
    .sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));

  res.status(200).json({ success: true, count: withDistance.length, farmers: withDistance });
});

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  setProductStatus,
  getProducts,
  getProductById,
  getMyProducts,
  getNearbyFarmers,
};
