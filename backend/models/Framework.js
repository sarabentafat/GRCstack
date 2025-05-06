const mongoose = require("mongoose");

// Define the schema for the levels (recursive structure)
const levelSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
    },
    level_name: {
      type: String,
      default: "",
    },
    identifier: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    is_ratable: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Not Started",
    },
    evidence: {
      type: [String],
      default: [],
    },
    children: {
      type: [this], // Self-referencing for recursive structure
      default: [],
    },
  },
  { _id: false } // No need for _id in subdocuments
);

// Define the main Framework schema
const frameworkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assumes a User model exists
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Framework",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    version: {
      type: String,
      default: "1.0",
    },
    provider: {
      type: String,
      default: "Unknown",
    },
    language: {
      type: String,
      default: "English",
    },




    levels: {
      type: [levelSchema],
      default: [],
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Framework", frameworkSchema);
