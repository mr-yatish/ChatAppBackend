const { UserService } = require("./services");
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
    console.log("A user connected", socket.id);

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

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = setupSocket;
