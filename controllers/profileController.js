//controllers/profileController.js

const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// Helper function to get file size in MB
const getFileSizeInMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

// Helper function to validate file exists
const validateFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded",
      message: "Please select a file to upload",
    });
  }
  return null;
};

// Upload image handler
exports.uploadImage = async (req, res) => {
  try {
    // Validate file exists
    const fileError = validateFile(req, res);
    if (fileError) return;

    const userId = req.user._id;
    const file = req.file;

    // Create relative path for frontend access
    const filePath = `/uploads/images/${file.filename}`;

    // Update user profile with image path
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: filePath },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        filename: file.filename,
        originalName: file.originalname,
        filePath: filePath,
        fileSize: getFileSizeInMB(file.size),
        mimetype: file.mimetype,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      error: "Failed to upload image",
      message: error.message,
    });
  }
};

// Upload video handler
exports.uploadVideo = async (req, res) => {
  try {
    // Validate file exists
    const fileError = validateFile(req, res);
    if (fileError) return;

    const userId = req.user._id;
    const file = req.file;

    // Create relative path for frontend access
    const filePath = `/uploads/videos/${file.filename}`;

    // For videos, we might want to store the path separately
    // For now, we'll store it in a custom field or just return the path
    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      data: {
        filename: file.filename,
        originalName: file.originalname,
        filePath: filePath,
        fileSize: getFileSizeInMB(file.size),
        mimetype: file.mimetype,
        userId: user._id,
      },
    });
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({
      error: "Failed to upload video",
      message: error.message,
    });
  }
};

// Legacy upload handler (for backward compatibility)
exports.uploadProfileImage = async (req, res) => {
  try {
    // Validate file exists
    const fileError = validateFile(req, res);
    if (fileError) return;

    const userId = req.user._id;
    const file = req.file;

    // Store only the relative path for frontend access
    const profilePath = `/uploads/${file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: profilePath },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        filename: file.filename,
        originalName: file.originalname,
        filePath: profilePath,
        fileSize: getFileSizeInMB(file.size),
        mimetype: file.mimetype,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Profile upload error:", error);
    res.status(500).json({
      error: "Failed to upload profile image",
      message: error.message,
    });
  }
};
