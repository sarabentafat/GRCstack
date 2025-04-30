const express = require("express");
const router = express.Router();
const {
  getAllYears,
  getYearById,
  createYear,
  updateYear,
  deleteYear,
  AddModuleToYear,
} = require("../controllers/yearsController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
// /api/years
router.get("/", getAllYears);

// /api/years/:id
router.get("/:id", getYearById);

// /api/years
router.post("/", verifyToken, verifyTokenAndAdmin, createYear);

// /api/years/:id
router.put("/:id", verifyToken, verifyTokenAndAdmin, updateYear);
// /api/years/:id
router.put("/:id/addmoduletoyear", verifyToken, verifyTokenAndAdmin, AddModuleToYear);

// /api/years/:id
router.delete("/:id", verifyToken, verifyTokenAndAdmin, deleteYear);

module.exports = router;
