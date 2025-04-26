const { User, Friends } = require("../models");

const createUser = async (user) => {
  try {
    const newUser = await User.create(user);
    const token = newUser.generateAuthToken(); // Assuming generateAuthToken is a method in your User model

    const userObject = newUser.toObject(); // Convert mongoose document to plain object
    delete userObject.password; // Remove password field from the object

    return { user: userObject, token };
  } catch (error) {
    return false;
  }
};

const getUserById = async (userId, ispass = false) => {
  try {
    const query = ispass
      ? User.findById(userId).select("+password")
      : User.findById(userId);
    const user = await query;
    if (!user) {
      return false;
    }
    return user;
  } catch (error) {
    return false;
  }
};

const updateUser = async (userId, userData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return false;
    }
    return updatedUser;
  } catch (error) {
    return false;
  }
};

const findUserByEmail = async (email, ispass = false) => {
  try {
    const query = ispass
      ? User.findOne({ email, deleteFlag: false }).select("+password")
      : User.findOne({ email, deleteFlag: false });
    const user = await query;
    if (!user) {
      return false;
    }
    return user;
  } catch (error) {
    return false;
  }
};

const updateSocketId = async (userId, socketId) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { socketId },
      { new: true }
    );
    if (!updatedUser) {
      return false;
    }
    return updatedUser;
  } catch (error) {
    return false;
  }
};
const updateUserStatus = async (userId, status) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );
    if (!updatedUser) {
      return false;
    }
    return updatedUser;
  } catch (error) {
    return false;
  }
};

const getFriendRequest = async (userId) => {
  try {
    const user = await Friends.find({
      friendId: userId,
      deleteFlag: false,
      status: "pending",
    });
    if (!user) {
      return false;
    }
    return user.friendRequests;
  } catch (error) {
    return false;
  }
};

const getFriends = async (userId) => {
  try {
    const friends = await Friends.find({
      userId,
      deleteFlag: false,
      status: "accepted",
    }).populate("friendId", "_id name email profilePicture");
    if (!friends) {
      return false;
    }
    return friends;
  } catch (error) {
    return false;
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  findUserByEmail,
  updateSocketId,
  updateUserStatus,
  getFriendRequest,
  getFriends,
};
