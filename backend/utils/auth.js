const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // Ensure this value is a number or a string representing a timespan
  });
  return token;
};

module.exports = {
  generateToken,
};
