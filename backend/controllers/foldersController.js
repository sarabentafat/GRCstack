const asyncHandler = require("express-async-handler");
const Folder = require("../models/Folder"); // Changed Module to Folder
const mongoose = require("mongoose");

/**----------------------------------------------
 * @desc    Get all folders
 * @route   GET /api/folders
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getAllFolders = asyncHandler(async (req, res) => {
  try {
    const folders = await Folder.find().populate("packets");
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**----------------------------------------------
 * @desc    Get folder by ID
 * @route   GET /api/folders/:id
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getFolderById = asyncHandler(async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id).populate("packets");
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**----------------------------------------------
 * @desc    Create a new folder
 * @route   POST /api/folders
 * @method  POST
 * @access  Private
 * ----------------------------------------------*/
module.exports.createFolder = asyncHandler(async (req, res) => {
  try {
    // Convert packets to ObjectId array if it's a string
    let packets = req.body.packets;
    if (typeof packets === "string") {
      packets = JSON.parse(packets); // Convert string to array
    }

    // Create the folder without requiring folderPic
    const folder = await Folder.create({
      name: req.body.name,
      packets: packets,
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**----------------------------------------------
 * @desc    Update folder
 * @route   PUT /api/folders/:id
 * @method  PUT
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.updateFolder = asyncHandler(async (req, res) => {
  try {
    const { name, packets } = req.body;
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    folder.name = name || folder.name;
    folder.packets = packets || folder.packets;
    await folder.save();
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**----------------------------------------------
 * @desc    Delete folder
 * @route   DELETE /api/folders/:id
 * @method  DELETE
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.deleteFolder = asyncHandler(async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    await folder.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Folder removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**----------------------------------------------
 * @desc    Update folder by adding packets
 * @route   PUT /api/folders/:id
 * @method  PUT
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.updateFolder = asyncHandler(async (req, res) => {
  try {
    const { name, packets } = req.body; // Expecting `packets` as an array of packet IDs to add

    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Update folder name if provided
    if (name) {
      folder.name = name;
    }

    // Add new packets if provided
    if (packets && Array.isArray(packets)) {
      // Append new packets to the existing array
      folder.packets = [...new Set([...folder.packets, ...packets])]; // Ensuring uniqueness
    }

    await folder.save();
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
