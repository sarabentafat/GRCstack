const asyncHandler = require("express-async-handler");
const Subfield = require("../models/Subfield"); // Use Subfield here
const Field = require("../models/Field");

/**----------------------------------------------
 * @desc    Get all subfields
 * @route   GET /api/subfields
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getAllSubfields = asyncHandler(async (req, res) => {
  console.log(Subfield)
  console.log('ss')
  const subfields = await Subfield.find().populate({
    path: "years",
    populate: {
      path: "modules", // if you want to populate the modules field too
      select: "name", // specify which fields of the modules you want to include
    },
  }); // Correct model name
  res.status(200).json(subfields);
});

/**----------------------------------------------
 * @desc    Get subfield by ID
 * @route   GET /api/subfields/:id
 * @method  GET
 * @access  Public
 * ----------------------------------------------*/
module.exports.getSubfieldById = asyncHandler(async (req, res) => {
  try {
    console.log('wslt hna ')
const subfield = await Subfield.findById(req.params.id)
      .populate({
        path: "years",
        select: "name", // Fields to include in the years
      })
    if (!subfield) {
      return res.status(404).json({ message: "Subfield not found" });
    }

    res.status(200).json(subfield);
  } catch (error) {
    console.error("Error fetching subfield:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**----------------------------------------------
 * @desc    Create new subfield
 * @route   POST /api/subfields
 * @method  POST
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.createSubfield = asyncHandler(async (req, res) => {
  const { name, years} = req.body;
  // Check if the fieldId is valid and exists
  
  const subfield = new Subfield({ name, years }); // Correct model name
  await subfield.save();
  res.status(201).json(subfield);
});

/**----------------------------------------------
 * @desc    Update subfield
 * @route   PUT /api/subfields/:id
 * @method  PUT
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.updateSubfield = asyncHandler(async (req, res) => {
  const { name, fieldId ,years} = req.body;
  const subfield = await Subfield.findById(req.params.id); // Correct model name
  if (!subfield) {
    return res.status(404).json({ message: "Subfield not found" });
  }
  subfield.name = name;
  subfield.field = fieldId;
  subfield.years = years;
  await subfield.save();
  res.status(200).json(subfield);
});

/**----------------------------------------------
 * @desc    Add Year To Subfield
 * @route   PUT /api/subfields/:id
 * @method  PUT
 * @access  Private/Admin
 * ----------------------------------------------*/

module.exports.AddYearToSubfield = asyncHandler(async (req, res) => {
  const { year } = req.body; // assuming year is a single value
  console.log(year);

  const subfield = await Subfield.findById(req.params.id);
  if (!subfield) {
    return res.status(404).json({ message: "Subfield not found" });
  }

  // Check if the year is already added
  if (subfield.years.includes(year)) {
    return res
      .status(400)
      .json({ message: "Year already exists in this subfield" });
  }

  // Add the new year to the subfield's years array
  subfield.years.push(year);
  await subfield.save();

  res.status(200).json({ message: "Year added successfully", subfield });
});


/**----------------------------------------------
 * @desc    Delete subfield
 * @route   DELETE /api/subfields/:id
 * @method  DELETE
 * @access  Private/Admin
 * ----------------------------------------------*/
module.exports.deleteSubfield = asyncHandler(async (req, res) => {
  const subfield = await Subfield.findById(req.params.id); // Correct model name
  if (!subfield) {
    return res.status(404).json({ message: "Subfield not found" });
  }
  await subfield.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Subfield removed" });
});

