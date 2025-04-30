const mongoose = require("mongoose");
const { User } = require("./User");
const Schema = mongoose.Schema;

const levelSchema = new Schema(
  {
    name: {
      type: String,
      enum: ["university", "highschool", "middle school", "other"],
      required: true,
      unique: true,
    },
    // users: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //   }
    // ],
    fields: [
      {
        type: Schema.Types.ObjectId,
        ref: "Field", // Reference to the Field model
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Level", levelSchema);
