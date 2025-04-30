const mongoose = require("mongoose");

import { packetSchema } from "./Packet.js";
const Book = mongoose.model("Book", packetSchema);

module.exports = Book;
// // Validate creation of Packet
// function validateCreateBook(packet) {
//   const schema = Joi.object({
//     user: Joi.string(),
//     name: Joi.string().trim().min(1).max(100).required(),
//     description: Joi.string().trim().min(1),
//     likes: Joi.array().items(Joi.string()),
//     questions: Joi.array().items(
//       Joi.object({
//         questionText: Joi.string().trim().required(),
//         questionPic: Joi.object({
//           url: Joi.string()
//             .uri()
//             .default(
//               "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png"
//             ),
//           publicId: Joi.string().allow(null).default(null),
//         }).optional(),
//         options: Joi.array().items(
//           Joi.object({
//             optionText: Joi.string().trim().required(),
//             isCorrect: Joi.boolean().required(),
//           })
//         ),
//       })
//     ),
//     packetPic: Joi.object({
//       url: Joi.string()
//         .uri()
//         .default(
//           "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png"
//         ),
//       publicId: Joi.string().allow(null).default(null),
//     }).optional(),
//   });

//   return schema.validate(packet);
// }

// // Validate update of Packet
// function validateUpdatePacket(packet) {
//   const schema = Joi.object({
//     name: Joi.string().trim().min(1).max(100),
//     description: Joi.string().trim().min(1),
//     likes: Joi.array().items(Joi.string()),
//     questions: Joi.array().items(
//       Joi.object({
//         questionText: Joi.string().trim(),
//         questionPic: Joi.object({
//           url: Joi.string()
//             .uri()
//             .default(
//               "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png"
//             ),
//           publicId: Joi.string().allow(null).default(null),
//         }).optional(),
//         options: Joi.array().items(
//           Joi.object({
//             optionText: Joi.string().trim(),
//             isCorrect: Joi.boolean(),
//           })
//         ),
//       })
//     ),
//     packetPic: Joi.object({
//       url: Joi.string()
//         .uri()
//         .default(
//           "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png"
//         ),
//       publicId: Joi.string().allow(null).default(null),
//     }).optional(),
//   });

//   return schema.validate(packet);
// }

// module.exports = {
//   Packet,
//   validateCreatePacket,
//   validateUpdatePacket,
// };
