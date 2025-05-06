const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const Joi = require("joi");

// Validation schema for changing password
const validateChangePassword = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .required()
      .regex(/[a-z]/, 'lowercase')
      .regex(/[A-Z]/, 'uppercase')
      .regex(/[0-9]/, 'number'),
  });

  return schema.validate(data);
};
const validateForgotPassword = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(data);
};

const validateResetPassword = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

/**----------------------------------------------
 * @desc    Register New User
 * @route   POST /api/auth/register
 * @method  POST
 * @access  public
 * ----------------------------------------------*/
module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body); 
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = new User({
    username: req.body.username,
    gender: req.body.gender,
    email: req.body.email,
    password: hashedPassword,
    phonenumber: req.body.phonenumber,
    address: req.body.address,
  });

  await user.save();

  const token = await new Token({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  }).save();

  const url = `${process.env.BASE_URL}api/auth/${user._id}/verify/${token.token}`;
  await sendEmail(user.email, "Verify Email", url);

  res
    .status(201)
    .json({ message: "An email sent to your account please verify " });
});


/**----------------------------------------------
 * @desc    Check if either email or username exists
 * @route   POST /api/auth/check-email-username
 * @method  POST
 * @access  public
 * ----------------------------------------------*/
module.exports.checkEmailAndUsername = async (req, res) => {
  const { email, username } = req.body;

  try {
    if (!email || !username) {
      return res.status(400).json({ error: "Email and username are required" });
    }

    // Check if the email exists
    const emailExists = await User.findOne({ email: email });
    // Check if the username exists
    const usernameExists = await User.findOne({ username: username });

    // Determine the boolean values
    const emailExistsFlag = !!emailExists;
    const usernameExistsFlag = !!usernameExists;
    // Return an object with both results
    res.json({
      emailExists: emailExistsFlag,
      usernameExists: usernameExistsFlag
    });
  } catch (error) {
    console.error("Error checking email and username:", error);
    res.status(500).json({ error: "Server error" });
  }
};




/**----------------------------------------------
 * @desc    Login User
 * @route   POST /api/auth/login
 * @method  POST
 * @access  public
 * ----------------------------------------------*/
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  // Validation
  const { error } = validateLoginUser(req.body);
  // Error 400: Problem from the client if they didn't provide valid input
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // If user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  // Check if the password is correct
  const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid password or email" });
  }

  // Check if the user's account is verified
  if (!user.isAccountVerified) {
    let verificationToken = await Token.findOne({ userId: user._id });

    if (!verificationToken) {
      verificationToken = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const url = `${process.env.BASE_URL}api/auth/${user._id}/verify/${verificationToken.token}`;
      await sendEmail(user.email, "Verify Email", url);
    }

    return res.status(400).json({ message: "Email sent to verify account" });
  }

  // Generate token (JWT)
  const token = user.generateAuthTokens();
  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePic: user.profilePic,
    token,
    username: user.username,
  });
});


/**----------------------------------------------
 * @desc    verfiy  User account
 * @route   POST /api/auth/:userId/verify/:token
 * @method  GET
 * @access  public
 * ----------------------------------------------*/

module.exports.verifyUserAccountCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "Invalid link" });
  }

  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!token) {
    return res.status(400).json({ message: "Invalid link" });
  }

  await User.updateOne({ _id: user._id }, { isAccountVerified: true });
  await Token.deleteOne({ _id: token._id });

  res.status(200).json({ message: "Email verified successfully" });
});

/**----------------------------------------------
 * @desc    Refresh login token route
 * @route   POST /api/auth/refresh-token
 * @method  POST
 * @access  public
 * ----------------------------------------------*/
// Refresh token function
module.exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required." });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user by ID from refresh token payload
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Generate new access token and refresh token
    const { accessToken, newRefreshToken } = user.generateAuthTokens();
    // Update refresh token in the user document
    user.refreshToken = newRefreshToken;
    await user.save();

    // Respond with new tokens
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ error: "Invalid refresh token." });
  }
});

/**----------------------------------------------
 * @desc    Request Password Reset
 * @route   POST /api/auth/forgot-password
 * @method  POST
 * @access  public
 * ----------------------------------------------*/
module.exports.forgotPasswordCtrl = asyncHandler(async (req, res) => {
  // Validate input
  const { error } = validateForgotPassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Find user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate reset token
  // In forgotPasswordCtrl
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
  await user.save();

  // Send reset email
  const resetUrl = `${process.env.BASE_URL}api/auth/reset-password/${resetToken}`;
  const message = `You requested a password reset. Please visit the link to reset your password: ${resetUrl}`;
  await sendEmail(user.email, "Password Reset Request", message);

  res.status(200).json({ message: "Reset email sent" });
});

/**----------------------------------------------
 * @desc    Reset Password
 * @route   PUT /api/auth/reset-password/:resetToken
 * @method  PUT
 * @access  public
 * ----------------------------------------------*/
module.exports.resetPasswordCtrl = asyncHandler(async (req, res) => {
console.log(req.params.resetToken);
  // Hash the token to find the user
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
console.log("Received Token:", req.params.resetToken);
console.log("Hashed Token:", resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  console.log(user);

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Validate new password
  const { error } = validateResetPassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Update the password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});

/**---------------------------------------------- 
 * @desc    Change Password
 * @route   PUT /api/auth/change-password
 * @method  PUT
 * @access  private
 * ----------------------------------------------*/
module.exports.changePasswordCtrl = asyncHandler(async (req, res) => {
  // Check if currentPassword and newPassword are provided in the request body
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current password and new password are required" });
  }

  // Validate the new password using Joi
  const { error } = validateChangePassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Find the user by their ID (assumed to be available in req.user)
  const user = await User.findById(req.user._id);

  // Ensure the user exists
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the current password matches
  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  // Update the password (hash it first)
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});
