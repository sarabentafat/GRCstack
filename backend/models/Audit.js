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
  auditDate: { type: Date, default: Date.now },
  findings: [
    {
      levelId: { type: mongoose.Schema.Types.ObjectId, ref: "Level" },
      status: {
        type: String,
        enum: ["Compliant", "Non-Compliant"],
        default: "Non-Compliant",
      },
      evidence: [
        {
          name: String,
          fileUrl: String,
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Audit", AuditSchema);
