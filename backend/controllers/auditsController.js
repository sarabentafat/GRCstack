const asyncHandler = require("express-async-handler");
const Audit = require("../models/Audit");
const Project = require("../models/Project");
const mongoose = require("mongoose");

const Level = require("../models/Level");
const Framework = require("../models/Framework");

/**
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

  if (!projectId || !auditId) {
    return res
      .status(400)
      .json({ message: "projectId and auditId are required." });
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!project.audits.includes(auditId)) {
    return res
      .status(400)
      .json({ message: "Audit does not belong to this project" });
  }

  const audit = await Audit.findById(auditId).populate("frameworkId");
  if (!audit) {
    return res.status(404).json({ message: "Audit not found" });
  }

  const framework = audit.frameworkId;
  const ratableControls = [];

  // Recursively collect all is_ratable levels
  const collectRatable = (levels) => {
    levels.forEach((level) => {
      if (level.is_ratable) ratableControls.push(level);
      if (level.children?.length) {
        collectRatable(level.children);
      }
    });
  };

  collectRatable(framework.levels || []);

  const totalControls = ratableControls.length;
  const compliant = ratableControls.filter(
    (c) => c.status === "Compliant"
  ).length;
  const nonCompliant = ratableControls.filter(
    (c) => c.status === "Non-Compliant"
  ).length;
  const notStarted = ratableControls.filter(
    (c) => c.status === "Not Started"
  ).length;
  const inProgress = ratableControls.filter(
    (c) => c.status === "In Progress"
  ).length;

  const compliancePercentage =
    totalControls > 0 ? Math.round((compliant / totalControls) * 100) : 0;

  const stats = {
    totalControls,
    compliant,
    nonCompliant,
    inProgress,
    notStarted,
    compliancePercentage,
  };

  res.status(200).json({
    message: "Audit and stats retrieved successfully",
    audit,
    stats,
  });
});



 /* @desc    Update level status and recalculate audit status
 * @route   PUT /api/audits/:auditId/levels/:levelId/status
 * @access  Private
 */
const updateLevelStatusAndAudit = asyncHandler(async (req, res) => {
  const { projectId, auditId } = req.params;
  const { status, identifier } = req.body;

  if (
    !["Not Started", "In Progress", "Compliant", "Non-Compliant"].includes(
      status
    )
  ) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  // Step 1: Find the audit
  const audit = await Audit.findOne({ _id: auditId, projectId });
  if (!audit) {
    return res.status(404).json({ message: "Audit not found." });
  }

  // Step 2: Find the related framework
  const framework = await Framework.findById(audit.frameworkId);
  if (!framework || !Array.isArray(framework.levels)) {
    return res.status(404).json({ message: "Framework or levels not found." });
  }

  // Step 3: Update the level status
  let updated = false;

  const updateLevel = (levels) => {
    for (let level of levels) {
      if (level.identifier === identifier) {
        level.status = status;
        updated = true;
        return;
      }
      if (Array.isArray(level.children)) {
        updateLevel(level.children);
      }
    }
  };

  updateLevel(framework.levels);

  if (!updated) {
    return res
      .status(404)
      .json({ message: "Level with given identifier not found." });
  }

  framework.markModified("levels");
  await framework.save();

  // Re-fetch updated framework levels
  const updatedFramework = await Framework.findById(audit.frameworkId);

  // Step 4: Recalculate compliance percentage
  const flatten = (levels) => {
    return levels.reduce((acc, lvl) => {
      acc.push(lvl);
      if (Array.isArray(lvl.children)) {
        acc.push(...flatten(lvl.children));
      }
      return acc;
    }, []);
  };

  const allLevels = flatten(updatedFramework.levels);
  const total = allLevels.length;
  const compliant = allLevels.filter(
    (lvl) => lvl.status === "Compliant"
  ).length;

  const percentage = total === 0 ? 0 : (compliant / total) * 100;
  const formattedPercentage = Number(percentage.toFixed(3)); // 👈 round to 3 decimal places

  audit.status = formattedPercentage;
  await audit.save();

  res.status(200).json({
    message: "Level status and audit compliance updated successfully.",
    levelStatus: status,
    auditStatus: formattedPercentage,
  });
});
/**----------------------------------------------
 * @desc    Get audit details and level stats
 * @route   GET /api/projects/:projectId/audits/:auditId/stats
 * @method  GET
 * @access  Private
 * ----------------------------------------------*/

const getAuditStats = asyncHandler(async (req, res) => {
  const { projectId, auditId } = req.params;

  if (!projectId || !auditId) {
    return res.status(400).json({ message: "projectId and auditId are required." });
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!project.audits.includes(auditId)) {
    return res.status(400).json({ message: "Audit does not belong to this project" });
  }

  const audit = await Audit.findById(auditId).populate("frameworkId");
  if (!audit) {
    return res.status(404).json({ message: "Audit not found" });
  }

  const framework = audit.frameworkId;

  if (!framework || !framework.levels || framework.levels.length === 0) {
    return res.status(404).json({ message: "No levels found in the associated framework." });
  }

  // Flatten nested levels (recursive)
  const flattenLevels = (levels) => {
    let result = [];
    for (const level of levels) {
      result.push(level);
      if (level.children && level.children.length > 0) {
        result = result.concat(flattenLevels(level.children));
      }
    }
    return result;
  };

  const allLevels = flattenLevels(framework.levels);

  const statusCounts = {
    "Compliant": 0,
    "Non-Compliant": 0,
    "In Progress": 0,
    "Not Started": 0,
  };

  for (const level of allLevels) {
    const status = level.status || "Not Started";
    if (statusCounts[status] !== undefined) {
      statusCounts[status]++;
    } else {
      statusCounts[status] = 1; // In case of unexpected status
    }
  }

  const total = allLevels.length;
  const compliant = statusCounts["Compliant"] || 0;
  const completionPercentage = total > 0 ? Math.round((compliant / total) * 100) : 0;

  res.status(200).json({
    message: "Audit stats retrieved successfully",
    audit: {
      id: audit._id,
      name: audit.name,
      framework: framework.name,
    },
    levelStatusCounts: statusCounts,
    totalLevels: total,
    completionPercentage,
  });
});



module.exports = {
  createAudit,
  deleteAuditFromProject,
  getAuditFromProject,
  addAuditToProject,
  updateLevelStatusAndAudit,
  getAuditStats,
};
