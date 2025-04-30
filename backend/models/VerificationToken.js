const mongoose = require("mongoose");
//VerificationToken shema
const VerificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
//VerificationToken model
const VerificationToken = mongoose.model(
  "VerificationToken",
  VerificationTokenSchema
);


module.exports = VerificationToken;
