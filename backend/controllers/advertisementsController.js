const fs = require("fs");
const path = require("path");

const asyncHandler = require("express-async-handler");
const {
  Advertisement,
  validateCreateAdvertisement,
  validateUpdateAdvertisement,
} = require("../models/Advertisement.js");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const { post } = require("../routes/usersRoute");
/**----------------------------------------------
 * @desc    Create new Advertisement
 * @route   POST /api/advertisements
 * @method  POST
 * @access  private (only admin)
 * ----------------------------------------------*/
module.exports.createAdvertisementCtrl = asyncHandler(async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }

  // Data validation
  const { error } = validateCreateAdvertisement(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Upload photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
  // Create new dvertisement and save it to db
  const advertisement = await Advertisement.create({
    title: req.body.title,
    description: req.body.description,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
    user: req.user._id,
  });

  // Send response to client
  res.status(201).json(advertisement);

  // Remove image from the server
  fs.unlinkSync(imagePath);
});

/**----------------------------------------------
 * @desc    GET all advertisement
 * @route   GET /api/advertisements
 * @method  GET
 * @access  public (everyone )
 * ----------------------------------------------*/

module.exports.getAllAdvertisementsCtrl = asyncHandler(async (req, res) => {
  const POST_PER_IMAGE = 3;
  const { pageNumber, category } = req.query;
  let advertisements;
  if (pageNumber) {
    advertisements = await Advertisement.find()
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * POST_PER_IMAGE)
      .limit(POST_PER_IMAGE)
      .populate("user", ["-password"]);
  } else if (category) {
    advertisements = await Advertisement.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    advertisements = await Advertisement.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
    //we get the properties of the user
  }
  res.status(200).json(advertisements);
});

/**----------------------------------------------
 * @desc    GET single advertisements
 * @route   GET /api/advertisementss/:id
 * @method  GET
 * @access  public (everyone )
 * ----------------------------------------------*/
module.exports.getSingleAdvertisementCtrl = asyncHandler(async (req, res) => {
  let advertisement = await Advertisement.findById(req.params.id).populate(
    "user",
    ["-password"]
  );
  if (!advertisement) {
    res.status(400).json({ message: "advertisement not found" });
  }

  res.status(200).json(advertisement);
});
/**----------------------------------------------
 * @desc    GET advertisements count
 * @route   GET /api/advertisements/:id
 * @method  GET
 * @access  private admin only
 * /todo
 * ----------------------------------------------*/
module.exports.getAdvertisementsCount = asyncHandler(async (req, res) => {
  const count = await Advertisement.countDocuments({});

  res.status(200).json(count);
});
/**----------------------------------------------
 * @desc    delete Advertisement
 * @route   delete /api/advertisements/:id
 * @method  DELETE
 * @access  private (admin )
 * ----------------------------------------------*/
module.exports.deleteAdvertisementCtrl = asyncHandler(async (req, res) => {
  const advertisement = await Advertisement.findById(req.params.id);
  if (!advertisement) {
    return res.status(400).json({ message: "Advertisement doesnt exist " });
  }
  if (req.user.isAdmin ) {
    await Advertisement.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(advertisement.image.publicId);
    //@todo delete all COMMENTs of the Advertisement
    res.status(200).json({
      message: "Advertisement has been deleted succefully",
      advertisementId: advertisement._id,
    });
  } else {
    res.status(403).json({ message: "access denied ,forbidden" });
  }
});

/**----------------------------------------------
 * @desc    Update Advertisement
 * @route    Update /api/advertisements/:id
 * @method  PUT
 * @access  private admin
 * ----------------------------------------------*/
module.exports.updateAdvertisementCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateAdvertisement(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const advertisement = await Advertisement.findById(req.params.id);
  if (!advertisement) {
    return res.status(404).json({ message: "Advertisementt not found" });
  }

  if (req.user._id !== advertisement.user.toString()) {
    return res
      .status(401)
      .json({ message: "you are not authorized to update this post" });
  }

  const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,

      },
    },
    { new: true }
  ).populate("user", ["-password"]);
  res.status(200).json(updatedAdvertisement);
});

/**----------------------------------------------
 * @desc    Update Advertisement image
 * @route    Update /api/advertisements/upload-image/:id
 * @method  PUT
 * @access  private admin
 * ----------------------------------------------*/
module.exports.updateAdvertisementImageCtrl = asyncHandler(async (req, res) => {
  // Validation
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }

  const advertisement = await Advertisement.findById(req.params.id);
  if (!advertisement) {
    return res.status(404).json({ message: "advertisement not found" });
  }

  if (req.user._id !== advertisement.user.toString()) {
    return res
      .status(401)
      .json({ message: "you are not authorized to update this post" });
  }

  // Delete the old advertisement image
  await cloudinaryRemoveImage(advertisement.image.publicId);

  // Upload new image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
  //update the image in the db
  const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
    }
  );

  // Remove the image from the server
  fs.unlinkSync(imagePath);
  res.status(200).json(updatedAdvertisement);
});
