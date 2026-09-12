const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");

// @desc    Place a new order (customer)
// @route   POST /api/orders
// @access  Private/Customer
const placeOrder = asyncHandler(async (req, res) => {
  const { productId, quantity, deliveryType, deliveryAddress, paymentMethod, customerNote } = req.body;

  const product = await Product.findById(productId);
  if (!product || product.status !== "available") {
    res.status(400);
    throw new Error("Product is not available");
  }
  if (quantity > product.quantityAvailable) {
    res.status(400);
    throw new Error("Requested quantity exceeds available stock");
  }

  const order = await Order.create({
    customer: req.user._id,
    farmer: product.farmer,
    product: product._id,
    quantity,
    unitPriceAtOrder: product.price,
    totalPrice: product.price * quantity + (deliveryType === "home_delivery" ? product.deliveryCharge : 0),
    deliveryType,
    deliveryAddress,
    paymentMethod,
    customerNote,
  });

  await Notification.create({
    user: product.farmer,
    title: "புதிய ஆர்டர்",
    message: `${product.name} - ${quantity} ${product.unit} க்கு புதிய ஆர்டர் வந்துள்ளது`,
    type: "order",
    relatedOrder: order._id,
    relatedProduct: product._id,
  });

  res.status(201).json({ success: true, order });
});

// @desc    Farmer accepts or rejects an order
// @route   PATCH /api/orders/:id/respond
// @access  Private/Farmer
const respondToOrder = asyncHandler(async (req, res) => {
  const { status, farmerResponseNote } = req.body; // status: accepted | rejected
  const order = await Order.findById(req.params.id).populate("product");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only respond to your own orders");
  }
  if (!["accepted", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Status must be 'accepted' or 'rejected'");
  }

  order.status = status;
  order.farmerResponseNote = farmerResponseNote || "";

  if (status === "accepted") {
    const product = await Product.findById(order.product._id);
    product.quantityAvailable = Math.max(0, product.quantityAvailable - order.quantity);
    if (product.quantityAvailable === 0) product.status = "sold_out";
    await product.save();
  }

  await order.save();

  await Notification.create({
    user: order.customer,
    title: status === "accepted" ? "ஆர்டர் ஏற்கப்பட்டது" : "ஆர்டர் நிராகரிக்கப்பட்டது",
    message: `உங்கள் ஆர்டர் ${status === "accepted" ? "ஏற்கப்பட்டது" : "நிராகரிக்கப்பட்டது"}`,
    type: "order",
    relatedOrder: order._id,
  });

  res.status(200).json({ success: true, order });
});

// @desc    Update order status (e.g. out_for_delivery, completed) - farmer
// @route   PATCH /api/orders/:id/status
// @access  Private/Farmer
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only update your own orders");
  }
  order.status = req.body.status;
  await order.save();
  res.status(200).json({ success: true, order });
});

// @desc    Customer cancels their own pending order
// @route   PATCH /api/orders/:id/cancel
// @access  Private/Customer
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.customer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only cancel your own orders");
  }
  if (!["pending", "accepted"].includes(order.status)) {
    res.status(400);
    throw new Error("This order can no longer be cancelled");
  }
  order.status = "cancelled";
  await order.save();
  res.status(200).json({ success: true, order });
});

// @desc    Get orders for the logged-in customer
// @route   GET /api/orders/mine
// @access  Private/Customer
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
    .populate("product")
    .populate("farmer", "name village phone farmLocation")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @desc    Get incoming orders for the logged-in farmer (enquiries + sales history)
// @route   GET /api/orders/farmer
// @access  Private/Farmer
const getFarmerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ farmer: req.user._id })
    .populate("product")
    .populate("customer", "name phone")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
});

module.exports = {
  placeOrder,
  respondToOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
  getFarmerOrders,
};
