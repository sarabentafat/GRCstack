const asyncHandler = require("express-async-handler");
const {
  Packet,
  validateCreatePacket,
  validateUpdatePacket,
} = require("../models/Packet");
const path = require("path");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const fs = require("fs");

const { Like } = require("../models/Like"); 
/**----------------------------------------------
 * @desc    Get all packets
 * @route   GET /api/packets
 * @method  GET
 * @access  Public 
 * ----------------------------------------------*/
module.exports.getAllPackets = asyncHandler(async (req, res) => {
  try {
    const packets = await Packet.find().populate("questions").populate({
      path: "user", // Populate user field
      select: "username profilePic", // Adjust fields as needed
    });
    res.status(200).json(packets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**----------------------------------------------
 * @desc    Get a packet by ID
 * @route   GET /api/packets/:id
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getPacketsById = asyncHandler(async (req, res) => {
  try {
    // Fetch the packet and populate both questions and user
    const packet = await Packet.findById(req.params.id)
      .populate({
        path: 'questions',
        // Optionally, you can populate options in each question if needed
        populate: {
          path: 'options',
          select: 'optionText isCorrect' // Adjust fields as needed
        }
      })
      .populate({
        path: 'user', // Populate user field
        select: 'username profilePic' // Adjust fields as needed
      });

    if (!packet) {
      return res.status(404).json({ message: "Packet not found" });
    }

    res.json({
      packet
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



/**----------------------------------------------
 * @desc    Get all packets of non-admin users
 * @route   GET /api/packets/users
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getAllPacketsUsers = asyncHandler(async (req, res) => {
  try {
    console.log('hhhhhere')
    // Fetch packets that belong to non-admin users
    const packets = await Packet.find()
      .populate({
        path: "user",
        match: { isAdmin: false }, // Only populate if the user is not an admin
        select: "username profilePic", // Optionally select specific fields
      })
      .sort({ createdAt: -1 }); 

    // Filter out packets where the user is null (i.e., the user was an admin)
    const filteredPackets = packets.filter((packet) => packet.user !== null);

    res.status(200).json(filteredPackets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



/**----------------------------------------------
 * @desc    Create a new packet
 * @route   POST /api/packets
 * @method  POST
 * @access  Private
 * ----------------------------------------------*/

module.exports.createPacket = asyncHandler(async (req, res) => {
  try {
    console.log("create packet conroller hhh")
    let packetPic = null;
    const questions = JSON.parse(req.body.questions || "[]");
    const questionImages = {};
    const indexes = [];
    // Handle the main packet image
    if (req.files?.image?.[0]) {
      const imagePath = path.join(
        __dirname,
        `../uploads/${req.files.image[0].filename}`
      );
      const result = await cloudinaryUploadImage(imagePath);
      packetPic = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      fs.unlinkSync(imagePath); // Delete the file after uploading
    }

    // console.log("Main packet image uploaded");

    // Handle question images
    for (let i = 0; i < questions.length; i++) {
      const fieldName = `questionImage${i}`;
      // console.log("fild name",fieldName)
      if (req.files[fieldName]?.[0]) {
        const imagePath = path.join(
          __dirname,
          `../uploads/${req.files[fieldName][0].filename}`
        );
        const result = await cloudinaryUploadImage(imagePath);
        questionImages[i] = {
          url: result.secure_url,
          publicId: result.public_id,
        };
        indexes.push(i);
        fs.unlinkSync(imagePath); // Delete the file after uploading
      }
    }

    indexes.forEach((ind) => {
      console.log("indexe",ind)
      questions.forEach((question, index) => {
        // console.log(indexes)
        if (index === ind) {
          // console.log("index", index);
          // console.log("ind", ind);
          question.questionPic = questionImages[ind];
          console.log(questionImages[ind])
        }
      });
    });

    // // if (!packetPic) {
    // //   retur
    //  res.status(400).json({ message: "No main image provided" });
    // // }
    console.log(req.body.description)
console.log("questions",questions)
    const packet = await Packet.create({
      user: req.params.id, // Assuming req.user.id contains the ID of the authenticated user
      name: req.body.name,
      description: req.body.description,
      questions: questions,
      packetPic: packetPic,
    });

    res.status(201).json(packet);
  } catch (error) {
    console.error("Error creating packet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});





/**----------------------------------------------
 * @desc    Update an existing packet
 * @route   PUT /api/packets/:packetId/:userId
 * @method  PUT
 * @access  Private
 * ----------------------------------------------*/
module.exports.updatePacket = asyncHandler(async (req, res) => {
  try {
    const  packetId  = req.params.id;

    let packetPic = null;
    const questions = JSON.parse(req.body.questions || "[]");
    const questionImages = {};
    const indexes = [];

    // Handle the main packet image
    if (req.files?.image?.[0]) {
      const imagePath = path.join(
        __dirname,
        `../uploads/${req.files.image[0].filename}`
      );
      const result = await cloudinaryUploadImage(imagePath);
      packetPic = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      fs.unlinkSync(imagePath); // Delete the file after uploading
    }

    // Handle question images
    for (let i = 0; i < questions.length; i++) {
      const fieldName = `questionImage${i}`;
      if (req.files[fieldName]?.[0]) {
        const imagePath = path.join(
          __dirname,
          `../uploads/${req.files[fieldName][0].filename}`
        );
        const result = await cloudinaryUploadImage(imagePath);
        questionImages[i] = {
          url: result.secure_url,
          publicId: result.public_id,
        };
        indexes.push(i);
        fs.unlinkSync(imagePath); // Delete the file after uploading
      }
    }

    indexes.forEach((ind) => {
      questions.forEach((question, index) => {
        if (index === ind) {
          question.questionPic = questionImages[ind];
        }
      });
    });

    // Find the existing packet by ID
    const packet = await Packet.findById(packetId);

    if (!packet) {
      return res.status(404).json({ message: "Packet not found" });
    }
  

    // Update packet fields
    packet.name = req.body.name || packet.name;
    packet.description = req.body.description || packet.description;
    packet.questions = questions;
    if (packetPic) {
      packet.packetPic = packetPic;
    }

    // Save the updated packet
    await packet.save();

    res.status(200).json(packet);
  } catch (error) {
    console.error("Error updating packet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


/**----------------------------------------------
 * @desc    Delete packet
 * @route   DELETE /api/packets/:id
 * @method  DELETE
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.deletePacket = asyncHandler(async (req, res) => {
  try {
    const packet = await Packet.findById(req.params.id);
    if (!packet) {
      return res.status(404).json({ message: "Packet not found" });
    }

    // Ensure the user is either an admin or the owner of the packet
    if (req.user.isAdmin || req.user._id.toString() === packet.user.toString()) {

if (packet.packetPic && packet.packetPic.packetId) {
  await cloudinaryRemoveImage(packet.packetPic.packetId);
}

      await Packet.findByIdAndDelete(req.params.id);

      // @todo: delete all COMMENTS related to the packet

      return res.status(200).json({ message: "Packet successfully deleted" });
    } else {
      return res.status(403).json({ message: "Not authorized to delete this packet" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});


/**----------------------------------------------
 * @desc    Get packets by user ID
 * @route   GET /api/packets/user/:userId
 * @method  GET
 * @access  Private
 * ----------------------------------------------*/
module.exports.getPacketsByUserId = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    // Assurez-vous que l'ID de l'utilisateur est valide
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Rechercher les paquets associés à l'utilisateur spécifié
    const packets = await Packet.find({ user: userId })
      .populate("questions")
      .populate({
        path: "user", // Populate user field
        select: "username profilePic", // Adjust fields as needed
      });;

    // Vérifier si des paquets ont été trouvés
    if (packets.length === 0) {
      return res.status(404).json({ message: "No packets found for this user" });
    }

    res.status(200).json(packets);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


/**----------------------------------------------
 * @desc    Toggle like on a packet
 * @route   PUT /api/packets/:id/like
 * @method  PUT
 * @access  logged in users
 * ----------------------------------------------*/
module.exports.toggleLikePacket = asyncHandler(async (req, res) => {
  try {
    const packetId = req.params.id;
    const userId = req.user._id; // Assuming you have user authentication in place

    const packet = await Packet.findById(packetId);

    if (!packet) {
      return res.status(404).json({ message: "Packet not found" });
    }

    const userIndex = packet.likes.indexOf(userId);

    if (userIndex === -1) {
      // User has not liked the packet, so add the like
      packet.likes.push(userId);
      await packet.save();
      return res.status(200).json({ message: "Packet liked", likes: packet.likes.length });
    } else {
      // User has already liked the packet, so remove the like
      packet.likes.splice(userIndex, 1);
      await packet.save();
      return res.status(200).json({ message: "Packet unliked", likes: packet.likes.length });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {
  const packetId = req.params.id;
  const loggedInUser = req.user._id;

  try {
    let packet = await Packet.findById(packetId);

    if (!packet) {
      return res.status(404).json({ message: "Packet not found" });
    }

    const isPacketAlreadyLiked = packet.likes.includes(loggedInUser);

    if (isPacketAlreadyLiked) {
      // Remove the like
      packet = await Packet.findByIdAndUpdate(
        packetId, // Corrected from productId to packetId
        { $pull: { likes: loggedInUser } },
        { new: true }
      );

      // Delete the like document from the Like collection
      await Like.findOneAndDelete({ userId: loggedInUser, packetId });
    } else {
      // Add the like
      packet = await Packet.findByIdAndUpdate(
        packetId,
        { $push: { likes: loggedInUser } },
        { new: true }
      );

      // Create and save the like document to the Like collection
      const like = new Like({ userId: loggedInUser, packetId });
      await like.save();
    }

    res.json(packet);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});


/**----------------------------------------------
 * @desc    Get liked packets by user
 * @route   GET /api/packets/liked
 * @method  GET
 * @access  Private/logged in user 
 * ----------------------------------------------*/
module.exports.getLikedPackets = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is stored in req.user after token verification
    // Fetch packets that belong to non-admin users
    // const packets = await Packet.find().populate({
    //   path: "user",
    //   match: { isAdmin: false }, // Only populate if the user is not an admin
    //   select: "username profilePic", // Optionally select specific fields
    // });
    // Query the packets liked by the user
    const likedPackets = await Packet.find({ likes: userId }).populate({
      path: "user", 
      select: "username profilePic", // Optionally select specific fields
    });

    // Check if liked packets are found
    if (!likedPackets || likedPackets.length === 0) {
      return res.status(404).json({ message: "No liked packets found" });
    }

    res.status(200).json(likedPackets);
  } catch (error) {
    // Log the error to the server console for debugging purposes
    console.error("Error fetching liked packets:", error);

    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports.getUserFavoritesCtrl = asyncHandler(async (req, res) => {
  const loggedInUser = req.user._id;

  try {
    // Find all likes by the logged-in user
    const userLikes = await Like.find({ userId: loggedInUser }).populate({
      path: "packetId",
      populate: {
        path: "user", // Assumes that Packet has a reference to User
        select: "username profilePic", // Optionally select specific fields
      },
    });

    // Extract the packets from the user likes
    const favoritePackets = userLikes.map((like) => like.packetId);

    // Check if the user has any favorite packets
    if (favoritePackets.length === 0) {
      return res.status(404).json({ message: "No favorite packets found." });
    }

    res.json(favoritePackets);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**----------------------------------------------
 * @desc    Get is the packet liked by a specific user 
 * @route   GET /api/packets/isliked/:packetId
 * @method  GET
 * @access  Private/logged in user 
 * ----------------------------------------------*/
module.exports.isPacketLikedCtrl = asyncHandler(async (req, res) => {
  const packetId = req.params.id;
  const loggedInUser = req.user._id;

  try {
    // Check if the packet is already liked by the logged-in user
    const like = await Like.findOne({ userId: loggedInUser, packetId });

    if (like) {
      // If a like document exists, the packet is liked by the user
      return res.json({ isLiked: true });
    } else {
      // If no like document is found, the packet is not liked by the user
      return res.json({ isLiked: false });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});


/**----------------------------------------------
 * @desc    Star or unstar a question
 * @route   PUT /api/packets/:packetId/questions/:questionId/star
 * @method  PUT
 * @access  Private
 * ----------------------------------------------*/

module.exports.starQuestion = asyncHandler(async (req, res) => {
  console.log("star question controller working");

  const { packetId, questionId } = req.params;
  const userId = req.user._id;

  // Find the packet by ID
  const packet = await Packet.findById(packetId);
  if (!packet) {
    res.status(404);
    throw new Error("Packet not found");
  }

  // Find the question within the packet
  const question = packet.questions.id(questionId);
  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  // Check if the question is already starred by the user
  const isAlreadyStarred = question.starredBy.includes(userId);

  // Toggle star status
  if (isAlreadyStarred) {
    // Unstar the question
    question.starredBy.pull(userId);
  } else {
    // Star the question
    question.starredBy.push(userId);
  }

  // Update the isStarred property
  const isStarred = !isAlreadyStarred; // Set isStarred to the new status
  question.isStarred = isStarred;

  // Save the changes
  await packet.save();

  // Respond with the updated star status
  res.json({
    message: "Question star status updated",
    questionId: question._id,
    isStarred: question.isStarred,
  });
});


/**----------------------------------------------
 * @desc    Track a mistake for a question
 * @route   PUT /api/packets/:packetId/questions/:questionId/mistake
 * @method  PUT
 * @access  Private
 * ----------------------------------------------*/
module.exports.trackMistake = asyncHandler(async (req, res) => {
  const { packetId, questionId } = req.params;
  const userId = req.user._id;

  const packet = await Packet.findById(packetId);
  if (!packet) {
    res.status(404);
    throw new Error("Packet not found");
  }

  const question = packet.questions.id(questionId);
  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  const mistake = question.mistakes.find(mistake => mistake.user.toString() === userId.toString());

  if (mistake) {
    // Increment the count if the mistake already exists
    mistake.count += 1;
  } else {
    // Add a new mistake entry for the user
    question.mistakes.push({ user: userId, count: 1 });
  }

  await packet.save();

  res.status(200).json({ message: "Mistake recorded" });
});


/**----------------------------------------------
 * @desc    Get starred questions for the user
 * @route   GET /api/packets/:packetId/questions/starred
 * @method  GET
 * @access  Private
 * ----------------------------------------------*/
module.exports.getStarredQuestions = asyncHandler(async (req, res) => {
  const { packetId } = req.params;
  const userId = req.user._id;

  const packet = await Packet.findById(packetId);
  if (!packet) {
    res.status(404);
    throw new Error("Packet not found");
  }

  const starredQuestions = packet.questions.filter(question =>
    question.starredBy.includes(userId)
  );

  res.status(200).json(starredQuestions);
});

/**----------------------------------------------
 * @desc    Get questions the user made mistakes on
 * @route   GET /api/packets/:packetId/questions/mistaken
 * @method  GET
 * @access  Private
 * ----------------------------------------------*/
module.exports.getMistakenQuestions = asyncHandler(async (req, res) => {
  const { packetId } = req.params;
  const userId = req.user._id;

  const packet = await Packet.findById(packetId);
  if (!packet) {
    res.status(404);
    throw new Error("Packet not found");
  }

  const mistakenQuestions = packet.questions.filter(question =>
    question.mistakes.some(mistake => mistake.user.toString() === userId.toString() && mistake.count > 0)
  );

  res.status(200).json(mistakenQuestions);
});
