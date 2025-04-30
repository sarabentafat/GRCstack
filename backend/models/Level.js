const mongoose = require("mongoose");

// Define the Level schema
const LevelSchema = new mongoose.Schema(
  {
    level: Number,
    level_name: String,
    identifier: String,
    title: String,
    content: String,
    is_ratable: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Compliant", "Non-Compliant"],
      default: "Not Started",
    },
    evidence: [
      {
        name: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    children: [this], // Recursive nesting (CAUTION: this is experimental)
  },
  { _id: false }
);

// Create the model using the schema
const Level = mongoose.model("Level", LevelSchema);

module.exports = Level;
