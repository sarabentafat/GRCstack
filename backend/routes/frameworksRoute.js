const express = require("express");
const multer = require("multer");
const {
  uploadFramework,
  getFrameworks,
} = require("../controllers/frameworksController");

const router = express.Router();
const upload = multer();

router.post("/upload",  upload.single("file"), uploadFramework);
router.get("/", getFrameworks);

module.exports = router;
