//routes/profileRoutes.js

const express = require("express");
const router = express.Router();
const {
  imageUpload,
  videoUpload,
  legacyUpload,
} = require("../middleware/upload");
const {
  uploadImage,
  uploadVideo,
  uploadProfileImage,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /profile/upload-image:
 *   post:
 *     summary: Upload an image file
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg, jpg, png, gif, webp, max 20MB)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid file type or no file uploaded
 *       401:
 *         description: Unauthorized
 *       413:
 *         description: File too large
 */

/**
 * @swagger
 * /profile/upload-video:
 *   post:
 *     summary: Upload a video file
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file (mp4, mov, avi, mkv, max 20MB)
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *       400:
 *         description: Invalid file type or no file uploaded
 *       401:
 *         description: Unauthorized
 *       413:
 *         description: File too large
 */

/**
 * @swagger
 * /profile/upload-profile:
 *   post:
 *     summary: Upload a profile image (legacy endpoint)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file (jpeg, jpg, png, gif, webp, max 20MB)
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *       400:
 *         description: Invalid file type or no file uploaded
 *       401:
 *         description: Unauthorized
 *       413:
 *         description: File too large
 */

// New advanced upload routes
router.post("/upload-image", protect, imageUpload, uploadImage);
router.post("/upload-video", protect, videoUpload, uploadVideo);

// Legacy route for backward compatibility
router.post("/upload-profile", protect, legacyUpload, uploadProfileImage);

module.exports = router;
