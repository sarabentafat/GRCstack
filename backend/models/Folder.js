const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const folderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  packets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Packet",
    },
  ],
});

module.exports = mongoose.model("Folder", folderSchema);
