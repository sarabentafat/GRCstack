const express = require("express");
const multer = require("multer");
const {
  uploadFramework,
  getFrameworks,
  mappedFramework,
} = require("../controllers/frameworksController");
const { verifyTokenAndAuthorization, verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();
const upload = multer();

router.post("/upload", verifyToken, upload.single("file"), uploadFramework);
router.get("/", verifyToken,getFrameworks);
router.post(
  "/map",
  verifyToken,
  upload.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 },
  ]),
  mappedFramework
);
module.exports = router;
