// One-time helper to create (or promote) an admin account, since the public
// Register page only offers "farmer" / "customer".
// Usage: node utils/createAdmin.js <name> <10-digit-phone>
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("../config/db");
const User = require("../models/User");

const run = async () => {
  const [, , name, phone] = process.argv;
  if (!name || !phone) {
    console.log("Usage: node utils/createAdmin.js <name> <10-digit-phone>");
    process.exit(1);
  }

  await connectDB();

  let user = await User.findOne({ phone });
  if (user) {
    user.role = "admin";
    await user.save();
    console.log(`Existing user ${phone} promoted to admin.`);
  } else {
    user = await User.create({ name, phone, role: "admin" });
    console.log(`Admin account created for ${phone}.`);
  }

  console.log("You can now log in as admin from the Login page using this phone number + OTP.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
