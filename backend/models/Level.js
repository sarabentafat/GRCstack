const mongoose = require("mongoose");

// Define the Level schema
const LevelSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
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
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Level" }], // Reference to other levels
  },
  { _id: true }
);

// Create the model using the schema
const Level = mongoose.model("Level", LevelSchema);

module.exports = Level;
