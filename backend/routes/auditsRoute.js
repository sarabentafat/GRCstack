const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/verifyToken");
const { createAudit, deleteAuditFromProject, getAuditFromProject, updateLevelStatusAndAudit, getAuditStats } = require("../controllers/auditsController");
const { createAuditFromMapping } = require("../controllers/frameworksController");

router.post("/:projectId",verifyToken, createAudit);
router.delete("/:projectId/:auditId",verifyToken, deleteAuditFromProject);
router.get("/:projectId/:auditId", verifyToken, getAuditFromProject);
router.put("/:projectId/:auditId/status", updateLevelStatusAndAudit);
router.post("/:projectId/create-audit-from-mapping", createAuditFromMapping);
router.get(
  "/:projectId/:auditId/stats",
  getAuditStats
);

module.exports = router;
