const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/verifyToken");
const { createAudit, deleteAuditFromProject, getAuditFromProject, updateLevelStatusAndAudit } = require("../controllers/auditsController");
const { createAuditFromMapping } = require("../controllers/frameworksController");

router.post("/:projectId",verifyToken, createAudit);
router.delete("/:projectId/:auditId",verifyToken, deleteAuditFromProject);
router.get("/:projectId/:auditId", verifyToken, getAuditFromProject);
router.put("/:projectId/:auditId/status", updateLevelStatusAndAudit);
router.post("/:projectId/create-audit-from-mapping", createAuditFromMapping);

module.exports = router;
