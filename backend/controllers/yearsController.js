const asyncHandler = require("express-async-handler");
const  Year  = require("../models/Year");

/**----------------------------------------------
 * @desc    Get all years
 * @route   GET /api/years
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getAllYears = asyncHandler(async (req, res) => {
  const years = await Year.find().populate("modules");
  
  res.status(200).json(years);
});

/**----------------------------------------------
 * @desc    Get year by ID
 * @route   GET /api/years/:id
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getYearById = asyncHandler(async (req, res) => {
  const year = await Year.findById(req.params.id).populate('modules')
  console.log('im here ')
  if (!year) {
    return res.status(404).json({ message: "Year not found" });
  }
  console.log('hereeeeee')
  res.status(200).json(year);
});

/**----------------------------------------------
 * @desc    Create new year
 * @route   POST /api/years
 * @method  POST
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.createYear = asyncHandler(async (req, res) => {
  console.log("wslt hna ou nn")

  const { name, modules} = req.body;
    // console.log(subfieldId);
  const year = new Year({ name, modules});
  await year.save();
  res.status(201).json(year);
});

/**----------------------------------------------
 * @desc    Update year
 * @route   PUT /api/years/:id
 * @method  PUT
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.updateYear = asyncHandler(async (req, res) => {
  const { name, modules } = req.body;
  const year = await Year.findById(req.params.id);
  console.log("year",year)
  console.log(modules)
  if (!year) {
    return res.status(404).json({ message: "Year not found" });
  }
  // year.name = name;
  year.modules= modules;
  await year.save();
  res.status(200).json(year);
});

/**----------------------------------------------
 * @desc    Add module to year
 * @route   PUT /api/years/:id/addModuleToYear
 * @method  PUT
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.AddModuleToYear = asyncHandler(async (req, res) => {
  const { module } = req.body; // Single module ID to be added

  // Find the year by ID
  const year = await Year.findById(req.params.id);

  if (!year) {
    return res.status(404).json({ message: "Year not found" });
  }

  // Ensure a module is provided
  if (!module) {
    return res.status(400).json({ message: "No module provided" });
  }

  // Check if the module is already added
  if (year.modules.includes(module)) {
    return res.status(400).json({ message: "Module already exists in this year" });
  }

  // Add the new module to the year's modules array
  year.modules.push(module);
  await year.save();

  res.status(200).json({
    message: "Module added successfully",
    year,
  });
});



/**----------------------------------------------
 * @desc    Delete year
 * @route   DELETE /api/years/:id
 * @method  DELETE
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.deleteYear = asyncHandler(async (req, res) => {
  const year = await Year.findById(req.params.id);
  if (!year) {
    return res.status(404).json({ message: "Year not found" });
  }
  await year.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Year removed" });
});
