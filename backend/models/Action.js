const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema({
  auditId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Audit",
    required: true,
  },
  levelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Level",
    required: true,
  },
  actionTitle: String,
  actionDescription: String,
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Action", ActionSchema);
