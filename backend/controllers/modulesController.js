const asyncHandler = require("express-async-handler");
const Module = require("../models/Module");
const path = require("path"); // Add this line at the top
const fs = require("fs");
const mongoose = require("mongoose");
const { cloudinaryUploadImage } = require('../utils/cloudinary'); // Utility function for uploading to Cloudinary

/**----------------------------------------------
 * @desc    Get all modules
 * @route   GET /api/modules
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getAllModules = asyncHandler(async (req, res) => {
  try {
    const modules = await Module.find().populate("packets");
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**----------------------------------------------
 * @desc    Get module by ID
 * @route   GET /api/modules/:id
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getModuleById = asyncHandler(async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate("packets");
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


/**----------------------------------------------
 * @desc    Create a new module
 * @route   POST /api/modules
 * @method  POST
 * @access  Private
 * ----------------------------------------------*/
module.exports.createModule = asyncHandler(async (req, res) => {
  try {
    let modulePic = null;

    // Handle the main module image
    if (req.files && req.files.image && req.files.image[0]) {
      const imagePath = path.join(
        __dirname,
        `../uploads/${req.files.image[0].filename}`
      );
      const result = await cloudinaryUploadImage(imagePath);
      modulePic = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      fs.unlinkSync(imagePath); // Delete the file after uploading
    }

    // Convert packets to ObjectId array if it's a string
    let packets = req.body.packets;
    if (typeof packets === "string") {
      packets = JSON.parse(packets); // Convert string to array
    }

    // Create the module without requiring modulePic
    const module = await Module.create({
      name: req.body.name,
      modulePic: modulePic, // Can be null if no image is provided
      packets: packets,
    });

    res.status(201).json(module);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




/**----------------------------------------------
 * @desc    Update module
 * @route   PUT /api/modules/:id
 * @method  PUT
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.updateModule = asyncHandler(async (req, res) => {
  try {
    const { name, packets } = req.body; // Removed `yearId` and updated `packets`
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    module.name = name || module.name;
    module.packets = packets || module.packets; // Updated to reflect field change
    await module.save();
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**----------------------------------------------
 * @desc    Delete module
 * @route   DELETE /api/modules/:id
 * @method  DELETE
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.deleteModule = asyncHandler(async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    await module.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Module removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
/**----------------------------------------------
 * @desc    Update module
 * @route   PUT /api/modules/:id
 * @method  PUT
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.updateModule = asyncHandler(async (req, res) => {
  try {
    const { name, packets } = req.body; // Expecting `packets` as an array of packet IDs to add

    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Update module name if provided
    if (name) {
      module.name = name;
    }

    // Add new packets if provided
    if (packets && Array.isArray(packets)) {
      // Append new packets to the existing array
      module.packets = [...new Set([...module.packets, ...packets])]; // Ensuring uniqueness
    }

    await module.save();
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
