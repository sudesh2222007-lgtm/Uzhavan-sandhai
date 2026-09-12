const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Local disk storage for product/profile images -> served from /uploads.
// Swap this for a Cloudinary storage engine later without touching controllers,
// as long as req.files[].path (or a mapped URL) keeps being saved to the DB.
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ok) return cb(null, true);
  cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;
