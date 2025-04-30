const {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  getUsersCountCtrl,
  profilePhotoUploadCtrl,
  deleteUserProfileCtrl,
  addPointsCtrl,
  updateStreakCtrl,
} = require("../controllers/usersController");

const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");

const router = require("express").Router();
const validateObjectId = require("../middlewares/validateObjectId");
const photoUpload = require("../middlewares/photoUpload");

// api/users/profile
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl);
// api/users/profile/profile-photo-upload/:userId
router
  .route("/profile/profile-photo-upload/:id") // Fixed route to include / before :userId
  .put(verifyTokenAndAuthorization, photoUpload.single("image"), profilePhotoUploadCtrl);

// Route to add points
router
  .route("/profile/add-points/:id") // Updated route to include userId as a URL parameter
  .put(verifyTokenAndAuthorization,addPointsCtrl);//verifyTokenAndAuthorization,
// api/users/profile/:id
router
  .route("/profile/:id")
  .get(validateObjectId, getUserProfileCtrl)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfileCtrl)
  .delete(validateObjectId, verifyTokenAndAuthorization, deleteUserProfileCtrl);

// Route to update streak days for a user
router
  .route("/profile/update-streak/:id")
  .put(verifyTokenAndAuthorization, updateStreakCtrl);

// api/users/count
router.route("/count").get(verifyTokenAndAdmin, getUsersCountCtrl);


module.exports = router;
