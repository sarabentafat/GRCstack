const express = require("express");
const router = express.Router();
const {
createProject,
getProjects,
getProjectById,
} = require("../controllers/projectController");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/project",verifyToken, createProject);
router.get("/", verifyToken, getProjects);
router.get("/:id", verifyToken, getProjectById);

module.exports = router;