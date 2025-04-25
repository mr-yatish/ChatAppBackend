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
      const { userId, friendId } = data;
      if (userId && friendId) {
        const friend = await UserService.getUserById(friendId);
        // Store in Db
        const newFriend = new Friends({
          userId,
          friendId,
        });
        await newFriend.save();
        if (friend && friend.socketId) {
          io.to(friend.socketId).emit("friend:request", {
            newFriend,
          });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = setupSocket;
