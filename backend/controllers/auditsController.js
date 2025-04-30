const asyncHandler = require("express-async-handler");
const Audit = require("../models/Audit");
const Project = require("../models/Project");

/**----------------------------------------------
 * @desc    Create a new audit and link it to a project
 * @route   POST /api/audits
 * @method  POST
 * @access  Private
 * ----------------------------------------------*/
const createAudit = asyncHandler(async (req, res) => {
  const { projectId, frameworkId, findings } = req.body;

  if (!projectId || !frameworkId) {
    return res
      .status(400)
      .json({ message: "projectId and frameworkId are required." });
  }

  // Create the audit
  const newAudit = new Audit({
    projectId,
    frameworkId,
    findings: findings || [], // Optional at creation
  });

  const savedAudit = await newAudit.save();

  // Link audit to the project
  await Project.findByIdAndUpdate(projectId, {
    $push: { audits: savedAudit._id },
  });

  res.status(201).json({
    message: "Audit created successfully",
    audit: savedAudit,
  });
});

module.exports = {
  createAudit,
};
