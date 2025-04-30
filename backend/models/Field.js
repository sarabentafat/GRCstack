const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fieldSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  // level: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Level",
  //   required: true,
  // },
  subfields: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subfield",
    },
  ],
});


module.exports = mongoose.model("Field", fieldSchema);
