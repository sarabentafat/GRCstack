// models/FrameworkMapping.js
const mongoose = require("mongoose");

const FrameworkMappingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  frameworkA: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Framework" },
    name: String,
  },

  frameworkB: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Framework" },
    name: String,
  },

  mappings: [
    {
      frameworkA_id: String,
      frameworkA_title: String,
      frameworkA_content: String,

      frameworkB_id: String,
      frameworkB_title: String,
      frameworkB_content: String,

      similarity: Number,
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FrameworkMapping", FrameworkMappingSchema);
