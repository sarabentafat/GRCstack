const mongoose = require("mongoose");
const Joi = require("joi");

// Import Schema from mongoose
const { Schema } = mongoose;

// Define the Statistics schema
const StatisticsSchema = new Schema(

  {
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true

    },
    daysStreak: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        name: String,
        dateEarned: Date,
      },
    ],
    achievements: [
      {
        title: String,
        description: String,
        dateAchieved: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create the Statistics model
const Statistics = mongoose.model("Statistics", StatisticsSchema);

module.exports = {
  Statistics,
};
