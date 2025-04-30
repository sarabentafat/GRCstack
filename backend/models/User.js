const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// Import Schema from mongoose
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female"], // You can define your own set of genders or add more options as needed
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    address: {
      type: String,
      trim: true,
      minlength: 2,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
    },
    profilePic: {
      type: Object,
      default: {
        url: "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png",
        publicId: null,
      },
    },
    bio: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    phonenumber: {
      type: String, // Changed to String for phone numbers
      required: true,
    },
    following: [{ type: Schema.Types.ObjectId, ref: "User" }], // New field for following
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // New field for followers
    subscribed: {
      type: Boolean,
      default: false,
    }, // New field for subscription status

    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
    resetPasswordToken: {
      type: String,
      default: null, // Default to null until a reset token is generated
    },
    resetPasswordExpire: {
      type: Date,
      default: null, // Default to null until a reset token is generated
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate auth tokens
UserSchema.methods.generateAuthTokens = function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Set your desired expiration time
  );



  return { accessToken};
};

// User Model
const User = mongoose.model("User", UserSchema);

// Validate Register User
function validateRegisterUser(obj) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(100).required(),
    gender: Joi.string().valid("male", "female").optional(),
    email: Joi.string().min(5).max(100).email().required(),
    address: Joi.string().min(2).optional(),
    password: Joi.string().min(7).required(),
    phonenumber: Joi.string().required(),
  });
  return schema.validate(obj);
}

// Validate Login User
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().required(),
  });
  return schema.validate(obj);
}

// Validate Update User
function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100),
    username: Joi.string().trim().min(3).max(100),
    password: Joi.string().trim().min(7),
    bio: Joi.string(),
    phonenumber: Joi.string().min(10), // Changed to string for phone numbers
    gender: Joi.string().valid("male", "female"),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
