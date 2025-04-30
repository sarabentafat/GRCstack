const Level = require("../models/Level"); // Ensure the correct path to the Level model

const Field = require("../models/Field");

const asyncHandler = require("express-async-handler");

/**----------------------------------------------
 * @desc   Get all levels with theire fields
 * @route  /api/levels/
 * @method GET
 * @access public
 * ----------------------------------------------*/
module.exports.getAllLevelsCtrl = asyncHandler(async (req, res) => {
  const levels = await Level.find({}).populate('fields');
  res.status(200).json(levels);
});
//owner can have many houses
//level can have many users

/**
 * @desc    Create a new level
 * @route   POST /api/levels
 * @method  POST
 * @access  Private/Admin
 */
module.exports.createLevel = asyncHandler(async (req, res) => {
  const { name, fields } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Level name is required." });
  }

  try {
    // Check if the level name already exists
    const existingLevel = await Level.findOne({ name });
    if (existingLevel) {
      return res.status(400).json({ message: "Level name must be unique." });
    }
    

    // // Validate fields (optional)
    // if (fields && fields.length > 0) {
    //   // Check if all field IDs are valid
    //   const invalidFieldIds = [];
    //   for (const fieldId of fields) {
    //     if (!mongoose.Types.ObjectId.isValid(fieldId)) {
    //       invalidFieldIds.push(fieldId);
    //     }
    //   }
    //   if (invalidFieldIds.length > 0) {
    //     return res.status(400).json({ message: `Invalid field IDs: ${invalidFieldIds.join(', ')}` });
    //   }
      

    //   // Check if all field IDs exist in the database
    //   const validFields = await Field.find({ '_id': { $in: fields } });
    //   if (validFields.length !== fields.length) {
    //     return res.status(400).json({ message: "Some fields do not exist." });
    //   }
    // }

    // Create a new level
    const level = new Level({
      name,
      fields
    });

    // Save the level to the database
    await level.save();

    // Respond with success message and the created level
    res.status(201).json({
      message: "Level created successfully",
      level,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
/**
 * @desc get a level by id 
 * @route GET /api/levels/;id
 * @method GET
 * @access public
 */
// Get a level by ID
module.exports.getLevelById = async (req, res) => {
  try {
    const { id } = req.params;
    const level = await Level.findById(id).populate("fields");

    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    res.status(200).json(level);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
