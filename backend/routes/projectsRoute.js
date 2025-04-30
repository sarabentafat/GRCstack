const express = require("express");
const router = express.Router();
const {
createProject
} = require("../controllers/projectController");
const {

} = require("../middlewares/verifyToken");

router.post("/project", createProject);

module.exports = router;