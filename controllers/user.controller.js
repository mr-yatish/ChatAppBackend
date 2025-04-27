const { UserService } = require("../services");
const { User } = require("../models");
const cloudinary = require("../configs/cloudinary");
const fs = require("fs");

// SignUp Controller
const signUp = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    console.log(fullName, email, password, confirmPassword);

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
        data: false,
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Passwords do not match",
        data: false,
      });
    }
    const userExists = await UserService.findUserByEmail(email);
    if (userExists) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists", data: false });
    }

    const newUser = await UserService.createUser({
      name: fullName,
      email,
      password,
    });
    //  generate token use Usermodel method
    return res.status(201).json({
      status: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
        data: false,
      });
    }

    const user = await UserService.findUserByEmail(email, true); // true to include password in the query result
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found !",
        data: false,
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials",
        data: false,
      });
    }
    const token = user.generateAuthToken(); // Assuming generateAuthToken is a method in your User model

    const userObject = user.toObject(); // Convert mongoose document to plain object
    delete userObject.password; // Remove password field from the object

    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: { user: userObject, token },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};

// Get User details by id
const getUserByid = async (req, res) => {
  try {
    const userId = req.params.id; // Taking user ID from request parameters
    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "User found",
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};
// update user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // Taking user ID from request parameters
    const { name, email } = req.body;
    const user = await UserService.updateUser(userId, {
      name,
      email,
    });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};

// Update Profile Photo Controller
const updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.body.id; // Taking user ID from request parameters
    const filePath = req.file.path;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "profile_photos",
    });
    // Update user's profileImage field
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: result.display_name + "." + result.format },
      { new: true }
    );

    // Delete the local file after upload
    fs.unlinkSync(filePath);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile photo updated successfully", user });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to update profile photo" });
  }
};

// search User by name or email
const searchUser = async (req, res) => {
  try {
    const { searchQuery } = req.query;
    const query = {};
    query.deleteFlag = false; // Exclude deleted users
    // If searchQuery is provided, add it to the query object
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search by name
        { email: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search by email
      ];
    }
    const users = await User.find(query).limit(10); // Limit results to 10 users
    return res.status(200).json({
      status: true,
      message: "Users found",
      data: users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};

// Get FriendRequest
const getFriendRequest = async (req, res) => {
  try {
    const userId = req.params.id; // Taking user ID from request parameters
    const friendRequests = await UserService.getFriendRequest(userId);
    if (!friendRequests) {
      return res.status(404).json({
        status: false,
        message: "No friend requests found",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Friend requests found",
      data: friendRequests,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};

const getSentFriendRequest = async (req, res) => {
  try {
    const userId = req.params.id; // Taking user ID from request parameters
    const sentFriendRequests = await UserService.getSentFriendRequest(userId);
    if (!sentFriendRequests) {
      return res.status(404).json({
        status: false,
        message: "No sent friend requests found",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Sent friend requests found",
      data: sentFriendRequests,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.params.id; // Taking user ID from request parameters
    const friends = await UserService.getFriends(userId);
    if (!friends) {
      return res.status(404).json({
        status: false,
        message: "No friends found",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Friends found",
      data: friends,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};

// update friend request
const updateFriendRequest = async (req, res) => {
  try {
    const { userId, friendId, status, deleteFlag } = req.body; // Taking user ID and friend ID from request body
    const updatedUser = await UserService.updateFriendRequest(
      userId,
      friendId,
      status,
      deleteFlag
    );
    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Friend request updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};

module.exports = {
  signUp,
  login,
  updateProfilePhoto,
  getUserByid,
  updateUser,
  searchUser,
  getFriendRequest,
  getSentFriendRequest,
  getFriends,
  updateFriendRequest
};
