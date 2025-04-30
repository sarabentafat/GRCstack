const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const yearSchema = new Schema(
  {
    name: {
      type: Number,
      required: true,
      unique:true
    },
    modules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Year", yearSchema);
