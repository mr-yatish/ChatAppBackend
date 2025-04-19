const express = require("express");
const multer = require("multer");
const { UserController, updateProfilePhoto } = require("../controllers");
const authMiddleware = require("../middlewares/Auth.middleware");

const router = express.Router();

// Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" });

// Example controller functions (replace with actual implementations)

// Define routes
router.post("/signUp", UserController.signUp); // Register a new user
router.post("/login", UserController.login); // Register a new user
router.get("/profile/:id", UserController.getUserByid); // Get user details by ID
router.patch(
  "/profile-photo",
  upload.single("profileImage"),
  UserController.updateProfilePhoto
); // Update profile photo

module.exports = router;
