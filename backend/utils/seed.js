// Optional helper: populates the DB with demo market prices, news and a scheme
// so the Farmer Information Center isn't empty on first run.
// Run with: npm run seed
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("../config/db");
const MarketPrice = require("../models/MarketPrice");
const AgricultureNews = require("../models/AgricultureNews");
const GovernmentScheme = require("../models/GovernmentScheme");

const run = async () => {
  await connectDB();

  await MarketPrice.deleteMany();
  await AgricultureNews.deleteMany();
  await GovernmentScheme.deleteMany();

  await MarketPrice.insertMany([
    { productName: "தக்காளி", category: "காய்கறி", minPrice: 18, maxPrice: 28, avgPrice: 22, market: "கோயம்புத்தூர் சந்தை" },
    { productName: "வெங்காயம்", category: "காய்கறி", minPrice: 25, maxPrice: 35, avgPrice: 30, market: "கோயம்புத்தூர் சந்தை" },
    { productName: "நெல்", category: "தானியம்", minPrice: 20, maxPrice: 24, avgPrice: 22, unit: "kg", market: "தஞ்சாவூர் சந்தை" },
    { productName: "மாம்பழம்", category: "பழம்", minPrice: 40, maxPrice: 70, avgPrice: 55, market: "மதுரை சந்தை" },
  ]);

  await AgricultureNews.insertMany([
    {
      title: "இந்த வாரம் மழை பொழிவு எதிர்பார்ப்பு அதிகரிப்பு",
      content: "தமிழ்நாட்டில் இந்த வாரம் மிதமான மழை பொழிய வாய்ப்புள்ளது என வானிலை ஆய்வு மையம் தெரிவித்துள்ளது. விவசாயிகள் பயிர் பாதுகாப்பு நடவடிக்கைகளை மேற்கொள்ளுமாறு அறிவுறுத்தப்படுகிறார்கள்.",
    },
    {
      title: "இயற்கை உரம் தயாரிப்பதற்கான புதிய பயிற்சி முகாம்",
      content: "விவசாய ஆராய்ச்சி மையத்தால் இயற்கை உரம் தயாரிப்பது குறித்த இலவச பயிற்சி முகாம் அடுத்த மாதம் நடத்தப்படுகிறது.",
    },
  ]);

  await GovernmentScheme.insertMany([
    {
      title: "பிரதான் மந்திரி கிசான் சம்மான் நிதி",
      description: "சிறு மற்றும் குறு விவசாயிகளுக்கு ஆண்டுக்கு ரூ.6000 நேரடி நிதி உதவி வழங்கப்படுகிறது.",
      eligibility: "2 ஹெக்டேர் வரை நிலம் வைத்திருக்கும் விவசாயிகள்",
      applyLink: "https://pmkisan.gov.in",
    },
    {
      title: "தமிழ்நாடு விவசாயி இழப்பீட்டு காப்பீட்டு திட்டம்",
      description: "இயற்கை சீற்றத்தால் ஏற்படும் பயிர் இழப்புக்கு காப்பீட்டு பாதுகாப்பு.",
      eligibility: "பதிவு செய்யப்பட்ட அனைத்து விவசாயிகளும்",
      applyLink: "",
    },
  ]);

  console.log("Seed data inserted successfully");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
