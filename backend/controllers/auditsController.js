const asyncHandler = require("express-async-handler");
const Audit = require("../models/Audit");
const Project = require("../models/Project");
const mongoose = require("mongoose");

/**----------------------------------------------
 * @desc    Create a new audit and link it to a project
 * @route   POST /api/audits
 * @method  POST
 * @access  Private
 * ----------------------------------------------*/
const createAudit = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
  const { frameworkId, findings,scope,objectives,description } = req.body;

  if (!projectId || !frameworkId) {
    return res
      .status(400)
      .json({ message: "projectId and frameworkId are required." });
  }

  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Validate frameworkId as ObjectId
  if (!mongoose.Types.ObjectId.isValid(frameworkId)) {
    return res.status(400).json({ message: "Invalid frameworkId format" });
  }

  // Create the audit
  const newAudit = new Audit({
    name: req.body.name?.trim() || "Untitled Audit",
    projectId,
    frameworkId,
    scope: scope || "Default Scope",
    description: description || "Default Description",
    objectives: objectives || "Default Objectives",
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

/**----------------------------------------------
 * @desc    Add an audit to an existing project
 * @route   POST /api/projects/:id/audits
 * @method  POST
 * @access  Private
 * ----------------------------------------------*/
const addAuditToProject = asyncHandler(async (req, res) => {
  const { frameworkId, findings } = req.body;
  const { id: projectId } = req.params;

  if (!projectId || !frameworkId) {
    return res
      .status(400)
      .json({ message: "projectId and frameworkId are required." });
  }

  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Validate frameworkId as ObjectId
  if (!mongoose.Types.ObjectId.isValid(frameworkId)) {
    return res.status(400).json({ message: "Invalid frameworkId format" });
  }

  // Create the audit
  const newAudit = new Audit({
    projectId,
    frameworkId,
    findings: findings || [], // Optional at creation
  });

  const savedAudit = await newAudit.save();

  // Link audit to the project
  project.audits.push(savedAudit._id);
  await project.save();

  res.status(201).json({
    message: "Audit added to project successfully",
    audit: savedAudit,
    projectId,
  });
});

/**----------------------------------------------
 * @desc    Delete an audit from a project
 * @route   DELETE /api/projects/:projectId/audits/:auditId
 * @method  DELETE
 * @access  Private
 * ----------------------------------------------*/
const deleteAuditFromProject = asyncHandler(async (req, res) => {
  const { projectId, auditId } = req.params;

  if (!projectId || !auditId) {
    return res
      .status(400)
      .json({ message: "projectId and auditId are required." });
  }

  // Validate projectId and auditId as ObjectIds
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Invalid projectId format" });
  }
  if (!mongoose.Types.ObjectId.isValid(auditId)) {
    return res.status(400).json({ message: "Invalid auditId format" });
  }

  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Verify audit exists
  const audit = await Audit.findById(auditId);
  if (!audit) {
    return res.status(404).json({ message: "Audit not found" });
  }

  // Verify audit belongs to the project
  if (!project.audits.includes(auditId)) {
    return res.status(400).json({ message: "Audit does not belong to this project" });
  }

  // Remove audit from project's audits array
  await Project.findByIdAndUpdate(projectId, {
    $pull: { audits: auditId },
  });

  // Delete the audit
  await Audit.findByIdAndDelete(auditId);

  res.status(200).json({
    message: "Audit deleted successfully",
    projectId,
    auditId,
  });
});
/**----------------------------------------------
 * @desc    Get an audit from a project
 * @route   GET /api/projects/:projectId/audits/:auditId
 * @method  GET
 * @access  Private
 * ----------------------------------------------*/
const getAuditFromProject = asyncHandler(async (req, res) => {
  const { projectId, auditId } = req.params;

  // Validate projectId and auditId
  if (!projectId || !auditId) {
    return res
      .status(400)
      .json({ message: "projectId and auditId are required." });
  }



  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Verify audit belongs to the project
  if (!project.audits.includes(auditId)) {
    return res.status(400).json({ message: "Audit does not belong to this project" });
  }

  // Fetch audit and populate frameworkId
  const audit = await Audit.findById(auditId).populate("frameworkId");
  if (!audit) {
    return res.status(404).json({ message: "Audit not found" });
  }

  res.status(200).json({
    message: "Audit retrieved successfully",
    audit,
  });
});

module.exports = {
  createAudit,
  deleteAuditFromProject,
  getAuditFromProject,
  addAuditToProject,
};
