// middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to authenticate user
exports.authenticateUser = async (req, res, next) => {
  // Get token from request headers
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization denied. No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authorization denied. Invalid token" });
    }

    // Attach user object to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(401).json({ message: "Authorization denied. Invalid token" });
  }
};
