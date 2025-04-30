const express = require("express");
const router = express.Router();

const {} = require("../middlewares/verifyToken");
const { createAudit } = require("../controllers/auditsController");

router.post("/audit", createAudit);

module.exports = router;
