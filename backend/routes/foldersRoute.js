const express = require("express");
const router = express.Router();
const {
  getAllFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
} = require("../controllers/foldersController.js");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
} = require("../middlewares/verifyToken");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// /api/folders
router.get("/", getAllFolders);

// /api/folders/:id
router.get("/:id", getFolderById);

// /api/folders
router.post(
  "/",
  verifyToken,
  createFolder
);

// /api/folders/:id
router.put("/:id", verifyToken, updateFolder);

// /api/folders/:id
router.delete("/:id", verifyToken, deleteFolder);

module.exports = router;
