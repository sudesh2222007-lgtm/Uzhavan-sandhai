const mongoose = require("mongoose");

// Connects to MongoDB. Works directly with MongoDB Compass if you point
// MONGO_URI at your local instance, e.g. mongodb://127.0.0.1:27017/uzhavan_sandhai
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
