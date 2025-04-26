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
router.get("/profile/:id", authMiddleware, UserController.getUserByid); // Get user details by ID
router.patch(
  "/profile-photo",
  upload.single("profileImage"),
  authMiddleware,
  UserController.updateProfilePhoto
); // Update profile photo
router.patch("/update/:id", authMiddleware, UserController.updateUser); // Update user details
router.get("/search", authMiddleware, UserController.searchUser); // Get all users
router.get(
  "/friend-request/:id",
  authMiddleware,
  UserController.getFriendRequest
); // Get friend requests for a user
router.get(
  "/sent-friend-request/:id",
  authMiddleware,
  UserController.getSentFriendRequest
); // Get sent friend requests for a user
router.get("/friends/:id", authMiddleware, UserController.getFriends); // Get friends for a user
module.exports = router;
