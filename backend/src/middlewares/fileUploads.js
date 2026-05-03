const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
    resource_type: "auto",
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(
        new Error(
          `Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed. Received: ${file.mimetype}`
        )
      );
    }

    cb(null, true);
  },
});

module.exports = upload;
