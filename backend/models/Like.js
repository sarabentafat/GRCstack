
const mongoose = require("mongoose");

// Like Schema
const likeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    packetId: { type: mongoose.Schema.Types.ObjectId, ref: "Packet" },
  },
  {
    timestamps: true,
  }
);

// Like Model
const Like = mongoose.model("Like", likeSchema);

module.exports = {
  Like,
};
