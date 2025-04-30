const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  modulePic: {
    type: Object,
    default: {
      url: "",
      publicId: null,
    },
  },
  packets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Packet",
    },
  ],
});

module.exports = mongoose.model("Module", moduleSchema);
