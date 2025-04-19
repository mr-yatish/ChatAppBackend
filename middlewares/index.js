// Export all middlewares from this file
// Example: module.exports.authMiddleware = require("./authMiddleware");
const authMiddleware = require("./Auth.middleware");
const setupMiddlewares = require("./setupMiddlewares.middleware");
module.exports = { authMiddleware, setupMiddlewares };
