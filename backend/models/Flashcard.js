const mongoose = require("mongoose");
const Joi = require("joi");

// Define Flashcard Schema
const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL to the image
    required: false, // Optional
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Flashcard model
const Flashcard = mongoose.model("Flashcard", flashcardSchema);

// Validate create Flashcard
function validateCreateFlashcard(obj) {
  const schema = Joi.object({
    question: Joi.string().trim().required(),
    answer: Joi.string().trim().required(),
    image: Joi.string().uri().trim().optional(), // Optional image URL
    createdBy: Joi.string().trim().required(), // Assuming createdBy is a user ID
  });
  return schema.validate(obj);
}

// Validate update Flashcard
function validateUpdateFlashcard(obj) {
  const schema = Joi.object({
    question: Joi.string().trim(),
    answer: Joi.string().trim(),
    image: Joi.string().uri().trim().optional(), // Optional image URL
    createdBy: Joi.string().trim(), // Assuming createdBy is a user ID
    createdAt: Joi.date(),
  });
  return schema.validate(obj);
}

module.exports = {
  Flashcard,
  validateCreateFlashcard,
  validateUpdateFlashcard,
};
