const asyncHandler = require("express-async-handler");
const Field  = require("../models/Field");
const Level=require("../models/Level");
const Subfield = require("../models/Subfield");

/**----------------------------------------------
 * @desc    Get all fields
 * @route   GET /api/fields
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getAllFields = asyncHandler(async (req, res) => {
   const fields = await Field.find().populate('subfields');
  // ({
  //   path: "subfields",
  //   populate: {
  //     path: "years",
  //     select: "name", // Specify which fields of years you want to include
  //   },
  // });
  res.status(200).json(fields);
});

/**----------------------------------------------
 * @desc    Get field by ID
 * @route   GET /api/fields/:id
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getFieldById = asyncHandler(async (req, res) => {
  // Find the field by ID
  const field = await Field.findById(req.params.id).populate({
    path: "subfields",
    populate: {
      path: "years",
      select: "name", // Specify which fields of years you want to include
    },
  });
  // Check if the field exists
  if (!field) {
    return res.status(404).json({ message: "Field not found" });
  }

  // Return the field
  res.status(200).json(field);
});

/**----------------------------------------------
 * @desc    Create new field
 * @route   POST /api/fields
 * @method  POST
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.createField = asyncHandler(async (req, res) => {
  const { name, subfields } = req.body;

  if (!name || !Array.isArray(subfields)) {
    return res
      .status(400)
      .json({ message: "Name and subfields are required." });
  }

  try {
    const field = new Field({ name, subfields });
    await field.save();
    res.status(201).json({ message: "Field created successfully", field });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: "Field name must be unique." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


/**----------------------------------------------
 * @desc    Update an existing field
 * @route   PUT /api/fields/:id
 * @method  PUT
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.updateField = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name,  subfields } = req.body;

  // Find the field by ID
  const field = await Field.findById(id);

  // If the field does not exist, return a 404 error
  if (!field) {
    return res.status(404).json({ message: "Field not found" });
  }

  // Update the field properties
  field.name = name || field.name;
  field.subfields = subfields || field.subfields;

  // Save the updated field
  const updatedField = await field.save();

  // Send the updated field in the response
  res.status(200).json(updatedField);
});

/**----------------------------------------------
 * @desc    Delete a field
 * @route   DELETE /api/fields/:id
 * @method  DELETE
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.deleteField = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the field by ID and delete it
  const field = await Field.findByIdAndDelete(id);
  

  // If the field does not exist, return a 404 error
  if (!field) {
    return res.status(404).json({ message: "Field not found" });
  }

  // Send a success response
  res.status(200).json({ message: "Field deleted successfully" });
});


/**----------------------------------------------
 * @desc    Get all fields by level ID
 * @route   GET /api/fields/level/:levelId
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getFieldsByLevelId = asyncHandler(async (req, res) => {
  console.log('wsly hnz')
  const { levelId } = req.params;
  console.log(levelId)

  // Validate that the level exists
  const level = await Level.findById(levelId);
  if (!level) {
    return res.status(404).json({ message: "Level not found" });
  }

  // Find all fields associated with the level
  const fields = await Field.find({ level: levelId }).populate({
    path: "subfields",
    populate: {
      path: "years",
      select: "name",
    },
  });

  res.status(200).json(fields);
});
