const express = require("express");
const router = express.Router();
const {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} = require("../controllers/modulesController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' }); 
// const photoUpload = require("../middlewares/photoUpload");

// /api/modules
router.get("/", getAllModules);

// /api/modules/:id
router.get("/:id", getModuleById);

// /api/modules
router.post("/", verifyToken, verifyTokenAndAdmin,upload.fields([{ name: 'image', maxCount: 1 }]), createModule);

// /api/modules/:id
router.put("/:id", verifyToken, verifyTokenAndAdmin, updateModule);

// /api/modules/:id
router.delete("/:id", verifyToken, verifyTokenAndAdmin, deleteModule);

module.exports = router;
