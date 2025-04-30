const mongoose = require("mongoose");
const Joi = require("joi");

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Comment Model
const Comment = mongoose.model("Comment", commentSchema);

// Validate create comment
function validateCreateComment(obj) {
  const schema = Joi.object({
    productId: Joi.string().required().label("Product Id"),
    text: Joi.string().required().label("Text"),
  });
  return schema.validate(obj);
}

// Validate update comment
function validateUpdateComment(obj) {
  const schema = Joi.object({
    text: Joi.string().required().label("Text"),
  });
  return schema.validate(obj);
}

module.exports = {
  Comment,
  validateCreateComment,
  validateUpdateComment,
};
