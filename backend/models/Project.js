const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  audits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Audit" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", ProjectSchema);
