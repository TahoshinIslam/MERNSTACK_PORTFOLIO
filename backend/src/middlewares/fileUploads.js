const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Make sure the uploads dir exists at boot
const UPLOADS_DIR = path.resolve(__dirname, "../../../uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

//! Configure storage engine
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^A-Za-z0-9._-]/g, "");
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, "upload-" + unique + "-" + sanitizedFilename);
  },
});

// set file size limits and file filter
const uploadFile = multer({
  storage: fileStorageEngine,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

module.exports = uploadFile;
