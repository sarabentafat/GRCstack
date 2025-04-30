const mongoose = require("mongoose");
const Joi = require("joi");

const packetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packetPic: {
      type: Object,
      default: {
        url: "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png",
        publicId: null,
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      minlength: 1,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    questions: [
      {
        questionText: {
          type: String,
          required: true,
          trim: true,
        },
        questionPic: {
          type: Object,
          default: {
            url: "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png",
            publicId: null,
          },
        },
        options: [
          {
            optionText: {
              type: String,
              required: true,
              trim: true,
            },
            isCorrect: {
              type: Boolean,
              required: true,
            },
          },
        ],
        starredBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        mistakes: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            count: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const Packet = mongoose.model("Packet", packetSchema);

// Validate creation of Packet
function validateCreatePacket(packet) {
  const schema = Joi.object({
    user: Joi.string(),
    name: Joi.string().trim().min(1).max(100).required(),
    description: Joi.string().trim().min(1),
    likes: Joi.array().items(Joi.string()),
    questions: Joi.array().items(
      Joi.object({
        questionText: Joi.string().trim().required(),
        questionPic: Joi.object({
          url: Joi.string()
            .uri()
            .default(
              "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png"
            ),
          publicId: Joi.string().allow(null).default(null),
        }).optional(),
        options: Joi.array().items(
          Joi.object({
            optionText: Joi.string().trim().required(),
            isCorrect: Joi.boolean().required(),
          })
        ),
      })
    ),
    packetPic: Joi.object({
      url: Joi.string()
        .uri()
        .default(
          "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png"
        ),
      publicId: Joi.string().allow(null).default(null),
    }).optional(),
  });

  return schema.validate(packet);
}

// Validate update of Packet
function validateUpdatePacket(packet) {
  const schema = Joi.object({
    name: Joi.string().trim().min(1).max(100),
    description: Joi.string().trim().min(1),
    likes: Joi.array().items(Joi.string()),
    questions: Joi.array().items(
      Joi.object({
        questionText: Joi.string().trim(),
        questionPic: Joi.object({
          url: Joi.string()
            .uri()
            .default(
              "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png"
            ),
          publicId: Joi.string().allow(null).default(null),
        }).optional(),
        options: Joi.array().items(
          Joi.object({
            optionText: Joi.string().trim(),
            isCorrect: Joi.boolean(),
          })
        ),
      })
    ),
    packetPic: Joi.object({
      url: Joi.string()
        .uri()
        .default(
          "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png"
        ),
      publicId: Joi.string().allow(null).default(null),
    }).optional(),
  });

  return schema.validate(packet);
}

module.exports = {
  Packet,
  validateCreatePacket,
  validateUpdatePacket,
};
