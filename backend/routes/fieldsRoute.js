const express = require("express");
const router = express.Router();
const {
  getAllFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
  getFieldsByLevelId,
} = require("../controllers/fieldsController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
// /api/fields
router.get("/", getAllFields);

// /api/fields/:id
router.get("/:id", getFieldById);

// /api/fields
router.post("/", verifyToken, verifyTokenAndAdmin, createField);

// /api/fields/:id
router.put("/:id", verifyToken, verifyTokenAndAdmin, updateField);

// /api/fields/:id
router.delete("/:id", verifyToken, verifyTokenAndAdmin, deleteField);
// GET all fields by level ID
router.get("/level/:levelId", getFieldsByLevelId);

module.exports = router;
