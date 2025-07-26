//middleware/upload.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = ["uploads/", "uploads/images/", "uploads/videos/"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Common storage configuration with enhanced security
const createStorage = (destination) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      // Enhanced unique naming with additional security
      const timestamp = Date.now();
      const random = Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = `${timestamp}-${random}${ext}`;
      cb(null, safeName);
    },
  });

// File size limit: 20MB
const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

// Enhanced security: Block executable files and scripts
const isExecutableFile = (filename) => {
  const dangerousExtensions = [
    ".exe",
    ".bat",
    ".cmd",
    ".com",
    ".pif",
    ".scr",
    ".vbs",
    ".js",
    ".jar",
    ".msi",
    ".dmg",
    ".app",
    ".sh",
    ".py",
    ".php",
    ".pl",
    ".rb",
    ".ps1",
    ".psm1",
    ".psd1",
    ".psc1",
    ".psc2",
    ".cpl",
    ".gadget",
    ".msc",
    ".hta",
    ".wsf",
    ".wsh",
    ".reg",
    ".inf",
  ];
  const ext = path.extname(filename).toLowerCase();
  return dangerousExtensions.includes(ext);
};

// Enhanced image file filter with security checks
const imageFileFilter = (req, file, cb) => {
  // Check for executable files first
  if (isExecutableFile(file.originalname)) {
    return cb(
      new Error("Executable files are not allowed for security reasons!")
    );
  }

  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const ext = allowedImageTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mime = allowedImageTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
  }
};

// Enhanced video file filter with security checks
const videoFileFilter = (req, file, cb) => {
  // Check for executable files first
  if (isExecutableFile(file.originalname)) {
    return cb(
      new Error("Executable files are not allowed for security reasons!")
    );
  }

  const allowedVideoTypes = /mp4|mov|avi|mkv/;
  const ext = allowedVideoTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mime = allowedVideoTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only video files (mp4, mov, avi, mkv) are allowed!"));
  }
};

// Create upload instances with enhanced security
const imageUpload = multer({
  storage: createStorage("uploads/images/"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: maxFileSize,
    files: 1, // Only allow one file at a time
  },
});

const videoUpload = multer({
  storage: createStorage("uploads/videos/"),
  fileFilter: videoFileFilter,
  limits: {
    fileSize: maxFileSize,
    files: 1, // Only allow one file at a time
  },
});

// Legacy upload (for backward compatibility) with enhanced security
const legacyUpload = multer({
  storage: createStorage("uploads/"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: maxFileSize,
    files: 1, // Only allow one file at a time
  },
});

module.exports = {
  imageUpload: imageUpload.single("image"),
  videoUpload: videoUpload.single("video"),
  legacyUpload: legacyUpload.single("profile"), // For backward compatibility
  maxFileSize,
};
