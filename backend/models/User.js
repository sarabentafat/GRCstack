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
    // firstname: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   minlength: 3,
    //   maxlength: 100,
    // },
    // secondname: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   minlength: 3,
    //   maxlength: 100,
    // },
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
    // existing fields
    referralsource: {
      type: String,
      enum: ["Facebook", "Ami/Famille", "Instagram", "Tiktok", "Autre"],
      required: true,
    },
    statistics: {
      streakDays: {
        type: [String], // or Map if you prefer to use key-value pairs
        default: [],
      },
      lastActivityDate: {
        type: Date,
        default: null,
      },
      streakLength: {
        type: Number,
        default: 0, // Initialize streak length to 0
      },
      totalScore: {
        type: Number,
        default: 0,
      },
      badges: [
        {
          name: String,
          dateEarned: Date,
        },
      ],
      achievements: [
        {
          title: String,
          description: String,
          dateAchieved: Date,
        },
      ],
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
    level: {
      type: Schema.Types.ObjectId,
      ref: "Level",
      required: true,
    },
    field: {
      type: Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    subfield: {
      type: Schema.Types.ObjectId,
      ref: "Subfield",
      required: true,
    },
    year: {
      type: Schema.Types.ObjectId,
      ref: "Year",
      required: true,
    },
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
    // firstname: Joi.string().min(3).max(100).required(),
    // secondname: Joi.string().min(3).max(100).required(),
    gender: Joi.string().valid("male", "female").required(),
    email: Joi.string().min(5).max(100).email().required(),
    address: Joi.string().min(2).optional(),
    password: Joi.string().min(7).required(),
    phonenumber: Joi.string().required(),
    level: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/) // Validate ObjectId format
      .required(),
    field: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/) // Validate ObjectId format
      .required(),
    subfield: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/) // Validate ObjectId format
      .required(),
    year: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/) // Validate ObjectId format
      .required(),
    referralsource: Joi.string()
      .valid("Facebook", "Ami/Famille", "Instagram", "Tiktok", "Autre")
      .required(),
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
