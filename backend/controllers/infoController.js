const asyncHandler = require("express-async-handler");
const MarketPrice = require("../models/MarketPrice");
const AgricultureNews = require("../models/AgricultureNews");
const GovernmentScheme = require("../models/GovernmentScheme");

// @desc    Get today's market/mandi prices
// @route   GET /api/info/market-prices
// @access  Public
const getMarketPrices = asyncHandler(async (req, res) => {
  const prices = await MarketPrice.find().sort({ date: -1 }).limit(50);
  res.status(200).json({ success: true, prices });
});

// @desc    Create/update a market price entry (admin)
// @route   POST /api/info/market-prices
// @access  Private/Admin
const addMarketPrice = asyncHandler(async (req, res) => {
  const price = await MarketPrice.create(req.body);
  res.status(201).json({ success: true, price });
});

// @desc    Get agriculture news
// @route   GET /api/info/news
// @access  Public
const getNews = asyncHandler(async (req, res) => {
  const news = await AgricultureNews.find().sort({ createdAt: -1 }).limit(20);
  res.status(200).json({ success: true, news });
});

// @desc    Add agriculture news (admin)
// @route   POST /api/info/news
// @access  Private/Admin
const addNews = asyncHandler(async (req, res) => {
  const news = await AgricultureNews.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json({ success: true, news });
});

// @desc    Get government schemes
// @route   GET /api/info/schemes
// @access  Public
const getSchemes = asyncHandler(async (req, res) => {
  const schemes = await GovernmentScheme.find({ isActive: true }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, schemes });
});

// @desc    Add a government scheme (admin)
// @route   POST /api/info/schemes
// @access  Private/Admin
const addScheme = asyncHandler(async (req, res) => {
  const scheme = await GovernmentScheme.create(req.body);
  res.status(201).json({ success: true, scheme });
});

// @desc    Weather for a given lat/lng (proxy stub)
// @route   GET /api/info/weather?lat=&lng=
// @access  Public
// NOTE: This returns a clearly-labelled mock response. To go live, sign up for
// a free key at openweathermap.org and swap the body of this function for a
// fetch() call - the frontend contract (fields below) will not need to change.
const getWeather = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    isMock: true,
    weather: {
      temperature: 31,
      condition: "மேகமூட்டம்",
      humidity: 68,
      windSpeedKmh: 12,
      rainChancePercent: 40,
      forecast: [
        { day: "இன்று", high: 32, low: 24, rainChance: 40 },
        { day: "நாளை", high: 31, low: 23, rainChance: 55 },
        { day: "நாளை மறுநாள்", high: 30, low: 23, rainChance: 20 },
      ],
    },
  });
});

module.exports = {
  getMarketPrices,
  addMarketPrice,
  getNews,
  addNews,
  getSchemes,
  addScheme,
  getWeather,
};
