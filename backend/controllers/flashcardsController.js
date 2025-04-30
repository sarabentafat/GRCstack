const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const {
  Flashcard,
  validateCreateFlashcard,
  validateUpdateFlashcard,
} = require("../models/Flashcard");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const { User } = require("../models/User");

/**----------------------------------------------
 * @desc    Register new Flashcard
 * @route   POST /api/flashcards
 * @method  POST
 * @access  private (only logged-in user)
 * ----------------------------------------------*/
module.exports.createFlashcardCtrl = asyncHandler(async (req, res) => {
  const files = req.files;

  // Data validation
  const { error } = validateCreateFlashcard(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let imageUrl = null;

  // Check if files array exists and has elements, then upload image
  if (files && files.length > 0) {
    const file = files[0]; // Assuming only one image file is allowed
    const cloudinaryResponse = await cloudinaryUploadImage(file.path); // Assuming file.path is the path to the file
    if (cloudinaryResponse && cloudinaryResponse.secure_url) {
      imageUrl = cloudinaryResponse.secure_url;
    }
  }

  // Create new flashcard and save it to db
  const newFlashcard = await Flashcard.create({
    question: req.body.question,
    answer: req.body.answer,
    image: imageUrl, // Set the image URL if available
    createdBy: req.body.createdBy,
  });

  // Send response to client
  res.status(201).json(newFlashcard);
});
/**----------------------------------------------
 * @desc    GET all flashcards
 * @route   GET /api/flashcards
 * @method  GET
 * @access  public (everyone)
 * ----------------------------------------------*/
module.exports.getAllFlashcardsCtrl = asyncHandler(async (req, res) => {
  const FLASHCARDS_PER_PAGE = 3;
  const { pageNumber, createdBy } = req.query;
  let flashcards;

  if (pageNumber) {
    flashcards = await Flashcard.find()
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * FLASHCARDS_PER_PAGE)
      .limit(FLASHCARDS_PER_PAGE)
      .populate("createdBy", ["-password"]);
  } else if (createdBy) {
    flashcards = await Flashcard.find({ createdBy })
      .sort({ createdAt: -1 })
      .populate("createdBy", ["-password"]);
  } else {
    flashcards = await Flashcard.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", ["-password"]);
  }

  res.status(200).json(flashcards);
});

/**----------------------------------------------
 * @desc    GET single product
 * @route   GET /api/products/:id
 * @method  GET
 * @access  public (everyone)
 * ----------------------------------------------*/
module.exports.getSingleProductCtrl = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id).populate("user", [
    "-password",
  ]);
  if (!product) {
    res.status(400).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

/**----------------------------------------------
 * @desc    GET products count
 * @route   GET /api/products/:id
 * @method  GET
 * @access  public //nrmlmo nbdlha l admin only
 * /todo
 * ----------------------------------------------*/
module.exports.getProductsCount = asyncHandler(async (req, res) => {
  const count = await Product.countDocuments({});

  res.status(200).json(count);
});

/**----------------------------------------------
 * @desc    delete product
 * @route   delete /api/products/:id
 * @method  DELETE
 * @access  private (admin or only the owner of the product)
 * ----------------------------------------------*/
module.exports.deleteProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(400).json({ message: "Product doesn't exist" });
  }
  if (req.user.isAdmin || req.user._id == product.user.toString()) {
    await Product.findByIdAndDelete(req.params.id);
    await Promise.all(
      product.image.map((imaga) => {
        const publicId = imaga.url.split("/").pop().split(".")[0];
        return publicId ? cloudinaryRemoveImage(publicId) : Promise.resolve();
      })
    );
    // await cloudinaryRemoveImage(product.image.publicId);
    //@todo delete all COMMENTs of the Product
    res.status(200).json({
      message: "Product has been deleted successfully",
      productId: product._id,
    });
  } else {
    res.status(403).json({ message: "Access denied, forbidden" });
  }
});

/**----------------------------------------------
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @method  PUT
 * @access  private (only the owner of the product)
 * ----------------------------------------------*/
module.exports.updateProductCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateProduct(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (req.user._id !== product.user.toString()) {
    return res
      .status(401)
      .json({ message: "You are not authorized to update this product" });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        couleur: req.body.couleur,
      },
    },
    { new: true }
  ).populate("user", ["-password"]);

  res.status(200).json(updatedProduct);
});

/**----------------------------------------------
 * @desc    Update Product image
 * @route   PUT /api/products/upload-image/:id
 * @method  PUT
 * @access  private (only the owner of the Product)
 * ----------------------------------------------*/
module.exports.updateProductImageCtrl = asyncHandler(async (req, res) => {
  // Validation
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No images provided" });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (req.user._id !== product.user.toString()) {
    return res
      .status(401)
      .json({ message: "You are not authorized to update this product" });
  }

  // Delete the old product images
  try {
    for (const image of product.image) {
      await cloudinaryRemoveImage(image.publicId);
    }
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete old images" });
  }

  let images = [];
  // Upload each file to Cloudinary and construct image objects
  for (const file of files) {
    const cloudinaryResponse = await cloudinaryUploadImage(file.path); // Assuming file.path is the path to the file
    if (cloudinaryResponse && cloudinaryResponse.secure_url) {
      images.push({
        url: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
      });
    }
  }

  // Update the images in the database
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      $set: {
        image: images,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to update images in the database" });
  }
});

module.exports.addProductImageCtrl = asyncHandler(async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No images provided" });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let newImages = [];
  for (const file of files) {
    const cloudinaryResponse = await cloudinaryUploadImage(file.path); // Assuming file.path is the path to the file
    if (cloudinaryResponse && cloudinaryResponse.secure_url) {
      newImages.push({
        url: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
      });
    }
  }

  const updatedImages = [...product.image, ...newImages];

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
    $set: {
      image: updatedImages,
    },
  });

  res.status(200).json(updatedProduct);
});
module.exports.deleteProductImageCtrl = asyncHandler(async (req, res) => {
  const { imagesToDelete } = req.body;

  if (!imagesToDelete || imagesToDelete.length === 0) {
    return res.status(400).json({ message: "No images provided for deletion" });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  try {
    for (const imageId of imagesToDelete) {
      const imageToDelete = product.image.find(
        (img) => img.publicId === imageId
      );
      if (imageToDelete) {
        await cloudinaryRemoveImage(imageToDelete.publicId);
        product.image = product.image.filter((img) => img.publicId !== imageId);
      }
    }

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
/**----------------------------------------------
 * @desc    Like Product (toggle)
 * @route   PUT /api/products/like/:id
 * @method  PUT
 * @access  private (only logged-in user)
 * ----------------------------------------------*/
module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const loggedInUser = req.user._id;

  try {
    let product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const isProductAlreadyLiked = product.likes.find(
      (user) => user.toString() === loggedInUser
    );

    if (isProductAlreadyLiked) {
      product = await Product.findByIdAndUpdate(
        productId,
        { $pull: { likes: loggedInUser } },
        { new: true }
      );
    } else {
      product = await Product.findByIdAndUpdate(
        productId,
        { $push: { likes: loggedInUser } },
        { new: true }
      );
    }

    res.json(product);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

/**----------------------------------------------
 * @desc    Get likes count
 * @route   GET /api/products/like/:id
 * @method  GET
 * @access  public (only logged-in user)
 * ----------------------------------------------*/
module.exports.getFlashcardCountCtrl = asyncHandler(async (req, res) => {
  const flashcard = await Flashcard.findById(req.params.id);
  const count = product.likes.length;

  res.status(200).json(count);
});

// /**----------------------------------------------
//  * @desc    toggle like controller
//  * @route   Get /api/:id
//  * @method  GET
//  * @access  private (only logged-in user or admin )
//  * ----------------------------------------------*/
// module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {
//   const { id: flashcard } = req.params;
//   const loggedInUser = req.user._id;

//   try {
//     let product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const isProductAlreadyLiked = product.likes.includes(loggedInUser);

//     if (isProductAlreadyLiked) {
//       // Remove the like
//       product = await Product.findByIdAndUpdate(
//         productId,
//         { $pull: { likes: loggedInUser } },
//         { new: true }
//       );

//       // Delete the like document from the Like collection
//       await Like.findOneAndDelete({ userId: loggedInUser, productId });
//     } else {
//       // Add the like
//       product = await Product.findByIdAndUpdate(
//         productId,
//         { $push: { likes: loggedInUser } },
//         { new: true }
//       );

//       // Create and save the like document to the Like collection
//       const like = new Like({ userId: loggedInUser, productId });
//       await like.save();
//     }

//     res.json(product);
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });

// /**----------------------------------------------
//  * @desc    get user favorite products
//  * @route   Get /api/products/likes
//  * @method  GET
//  * @access  private (only logged-in user or admin )
//  * ----------------------------------------------*/

// module.exports.getUserFavoritesCtrl = asyncHandler(async (req, res) => {
//   try {
//     const { id: userId } = req.params;
//     // Check if the requester is the user themselves or an admin
//     const requesterId = req.user._id; // Assuming you have the user ID in the request object
//     const isAdmin = req.user.isAdmin; // Assuming you have an isAdmin flag for admin users
//     if (requesterId !== userId && !isAdmin) {
//       // If the requester is neither the user nor an admin, return unauthorized error
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     // If the requester is the user or an admin, fetch the user's favorite products
//     const userFavoriteProducts = await Like.find({ userId }).populate(
//       "productId"
//     );

//     res.status(200).json({ userFavoriteProducts });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// });
