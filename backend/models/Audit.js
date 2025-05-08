const mongoose = require("mongoose");

const AuditSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scope: String,
  description: String,
  objectives: String,
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  frameworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Framework",
    required: true,
  },
  status: {
  type: Number,
  default: 0, // % completion: 0–100
 },
  auditDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Audit", AuditSchema);
