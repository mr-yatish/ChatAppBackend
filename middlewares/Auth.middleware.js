const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get the token from the Authorization header or cookies
    const token =
      req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorised User", data: false });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    res.status(401).json({
      status: false,
      message: "Unauthorised User" + error.message,
      data: false,
    });
  }
};

module.exports = authMiddleware;
