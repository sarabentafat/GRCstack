const mongoose = require("mongoose");
const Joi = require("joi");

const AdvertisementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 200,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
    startDate: Date,
    endDate: Date,
  },
  {
    // add 2 properties createdAt updatedAt
    timestamps: true,
  }
);

// Advertisementmodel
const Advertisement = mongoose.model("Advertisement", AdvertisementSchema);

// Validate create Advertisement
function validateCreateAdvertisement(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(4).max(200).required(),
    description: Joi.string().trim().min(4).required(),

  });
  return schema.validate(obj);
}

// Validate update Advertisement
function validateUpdateAdvertisement(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(4).max(200),
    description: Joi.string().trim().min(4),
    category: Joi.string().trim(),
    couleur: Joi.string().trim(),
  });
  return schema.validate(obj);
}

module.exports = {
  Advertisement,
  validateCreateAdvertisement,
  validateUpdateAdvertisement,
};
