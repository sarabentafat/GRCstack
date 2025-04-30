const express = require("express");
const router = express.Router();
const photoUpload = require("../middlewares/photoUpload");
//   verifyToken,
const {
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  createAdvertisementCtrl,
  getAllAdvertisementsCtrl,
  getSingleAdvertisementCtrl,
  getAdvertisementsCount,
  deleteAdvertisementCtrl,
  updateAdvertisementCtrl,
  updateAdvertisementImageCtrl,
} = require("../controllers/advertisementsController");
const validateObjectId = require("../middlewares/validateObjectId");
router
  .route("/")
  .post(
    verifyTokenAndAdmin,
    photoUpload.single("image"),
    createAdvertisementCtrl
  )
  .get(getAllAdvertisementsCtrl);

router.route("/count").get(verifyTokenAndAdmin, getAdvertisementsCount);
//api/advertisements/:id
router
  .route("/:id")
  .get(validateObjectId, getSingleAdvertisementCtrl)
  .delete(validateObjectId, verifyTokenAndAdmin, deleteAdvertisementCtrl)
  .put(validateObjectId, verifyTokenAndAdmin, updateAdvertisementCtrl);

//api/advertisements/update-image/:id
router
  .route("/update-image/:id")
  .put(
    validateObjectId,
    verifyTokenAndAdmin,
    photoUpload.single("image"),
    updateAdvertisementImageCtrl
  );


module.exports = router;
