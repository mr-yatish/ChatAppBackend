// Import required modules
const express = require("express");
const http = require("http");
require("dotenv").config(); // Load environment variables from .env file
const connectDB = require("./db"); // MongoDB connection function
const { UserRouter } = require("./routes"); // User-related routes
const setupSocket = require("./socket"); // Socket setup function
const { setupMiddlewares } = require("./middlewares"); // Middleware setup function

// Set the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Health check route 
app.get("/", (req, res) => {
  res.status(200).send(`Server is running successfully! ${new Date()}`); 
});

// Create an HTTP server
const server = http.createServer(app);

// Setup middlewares
setupMiddlewares(app);

// Setup API routes
app.use("/api/users", UserRouter);


// Setup WebSocket functionality
setupSocket(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
