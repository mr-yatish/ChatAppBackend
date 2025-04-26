const { UserService } = require("./services");
const { Friends } = require("./models");
// This file sets up a WebSocket server using Socket.IO
// and listens for incoming connections. It also handles disconnections.
const setupSocket = (server) => {
  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // Handle user socket ID update
    socket.on("user:socketId", async (data) => {
      const { userId } = data;
      if (userId) {
        await UserService.updateSocketId(userId, socket.id);
      }
    });

    // Handle user status update
    socket.on("user:status", async (data) => {
      const { userId, status } = data;
      // Validate status value
      const validStatuses = ["online", "offline"];
      if (!validStatuses.includes(status)) {
        console.error("Invalid status value:", status);
        return;
      }
      // Update user status in the database
      if (userId) {
        await UserService.updateUserStatus(userId, status);
      }
    });

    // Handle friend request notifications
    socket.on("friend:request", async (data) => {
      try {
        const { userId, friendId } = data;
        if (userId && friendId) {
          // Fetch the friend's data
          const friend = await UserService.getUserById(friendId);
          if (!friend) {
            return console.error("Friend not found");
          }

          // Store the friend request in the database
          const newFriend = await new Friends({
            userId,
            friendId,
          }).save();

          // Populate the friend's data
          const populatedFriend = await Friends.findById(
            newFriend._id
          ).populate("userId", {
            name: 1,
            email: 1,
            profileImage: 1,
          });

          // Send the friend request notification to the friend if they are online
          if (friend.socketId) {
            io.to(friend.socketId).emit("friend:request", {
             newFriend: populatedFriend,
            });
          }
        }
      } catch (error) {
        console.error("Error handling friend request:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = setupSocket;
