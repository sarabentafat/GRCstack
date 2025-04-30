const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");

/**----------------------------------------------
 * @desc    Create a new project
 * @route   POST /api/projects
 * @method  POST
 * @access  Private
 * ----------------------------------------------*/
const createProject = asyncHandler(async (req, res) => {
  const { name, description, owner } = req.body;

  if (!name || !owner) {
    return res
      .status(400)
      .json({ message: "Project name and owner are required." });
  }

  const newProject = new Project({
    name,
    description,
    owner,
  });

  const savedProject = await newProject.save();

  res.status(201).json({
    message: "Project created successfully",
    project: savedProject,
  });
});

module.exports = { createProject };
