const express = require("express");
const multer = require("multer");
const { uploadFramework } = require("../controllers/frameworksController.js");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadFramework);

module.exports = router;
