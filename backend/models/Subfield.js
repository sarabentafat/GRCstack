const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subfieldSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User',

  },
  name: {
    type: String,
    required: true,
  },
  // field: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Field",
  //   required: true,
  // },
  years: [
    {
      type: Schema.Types.ObjectId,
      ref: "Year",
    },
  ],
});
module.exports = mongoose.model("Subfield", subfieldSchema);