import mongoose from "mongoose";

const FrameworkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    version: { type: String, required: true },
    description: { type: String, required: true },
    levels: [
      {
        level: { type: Number, required: true },
        level_name: { type: String, required: true },
        identifier: { type: String, required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        is_ratable: { type: Boolean, default: false },
        status: {
          type: String,
          enum: ["Not Started", "In Progress", "Compliant", "Non-Compliant"],
          default: "Not Started",
        },
        evidence: [
          {
            name: { type: String },
            fileUrl: { type: String },
            uploadedAt: { type: Date, default: Date.now },
          },
        ],
        children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Level" }],
      },
    ],
  },
  { timestamps: true }
);

const Framework = mongoose.model("Framework", FrameworkSchema);
export default Framework;
