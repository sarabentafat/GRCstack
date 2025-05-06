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

  try {
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
  } catch (error) {
    res.status(400).json({
      message: "Invalid project data",
      error: error.message,
    });
  }
});

/**----------------------------------------------
 * @desc    Get all projects
 * @route   GET /api/projects
 * @method  GET
 * @access  Private
 * ----------------------------------------------*/
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().populate("audits");

  if (!projects || projects.length === 0) {
    return res.status(404).json({ message: "No projects found" });
  }

  res.status(200).json({
    message: "Projects retrieved successfully",
    projects,
  });
});

/**----------------------------------------------
 * @desc    Get project by ID
 * @route   GET /api/projects/:id
 * @method  GET
 * @access  Private
 * ----------------------------------------------*/
const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Find project and populate audits with their frameworkId
  const project = await Project.findById(id).populate({
    path: "audits",
    populate: {
      path: "frameworkId",
      model: "Framework",
    },
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.status(200).json({
    message: "Project retrieved successfully",
    project,
  });
});

module.exports = { createProject,getProjects,getProjectById };
