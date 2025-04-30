const express = require("express");
const router = express.Router();
const {
  getAllPackets,
  // getPacketById,
  createPacket,
  updatePacket,
  deletePacket,
  getPacketsByUserId,
  // toggleLikePacket,
  // getLikedPackets,
  getAllPacketsUsers,
  getPacketsById,
  toggleLikeCtrl,
  getUserFavoritesCtrl,
  isPacketLikedCtrl,
  starQuestion,
  trackMistake,
  getStarredQuestions,
  getMistakenQuestions,
} = require("../controllers/packetsController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' }); 
const validateObjectId = require("../middlewares/validateObjectId");
// const photoUpload = require("../middlewares/photoUpload");

// Route to get packets by userId
router.route("/users").get(getAllPacketsUsers);

router.route("/:id").post(verifyToken,upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'questionImage0', maxCount: 1 },
  { name: 'questionImage1', maxCount: 1 }]),createPacket
)

// Route to get all packets and create a new packet
router.route("/")
.get(getAllPackets);

router
  .route("/liked/:id")
  .get(verifyTokenAndAuthorization, getUserFavoritesCtrl
  );

router.route("/isliked/:id").get(verifyToken, isPacketLikedCtrl);
// ,



//verifyTokenAndAuthorization, 

// Route to get, update, or delete a packet by ID
router
  .route("/:id")
  .get(getPacketsById)
  .put(verifyToken,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "questionImage0", maxCount: 1 },
      { name: "questionImage1", maxCount: 1 },
    ]),
    updatePacket
  )
  .delete(validateObjectId,verifyToken, deletePacket);
//verifyTokenAndAdmin,
// Route to get packets by userId
router.route("/user/:userId").get(getPacketsByUserId);


// Route to toggle like on a packet
router.put("/like/:id",verifyToken, toggleLikeCtrl);
//, verifyToken

// Route to get all packets liked by the authenticated user

// Route to star or unstar a question
router.route('/:packetId/questions/:questionId/star')
  .put(verifyToken, starQuestion);

// Route to track a mistake for a question
router.route('/:packetId/questions/:questionId/mistake')
  .put(verifyToken, trackMistake);

// Route to get starred questions for the user
router.route('/:packetId/questions/starred')
  .get(verifyToken, getStarredQuestions);

// Route to get questions the user made mistakes on
router.route('/:packetId/questions/mistaken')
  .get(verifyToken, getMistakenQuestions);

module.exports = router;
