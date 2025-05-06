const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/verifyToken");
const { createAudit, deleteAuditFromProject, getAuditFromProject } = require("../controllers/auditsController");

router.post("/:projectId",verifyToken, createAudit);
router.delete("/:projectId/:auditId",verifyToken, deleteAuditFromProject);
router.get("/:projectId/:auditId", verifyToken, getAuditFromProject);

module.exports = router;
