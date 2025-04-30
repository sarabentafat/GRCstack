const express = require("express");
const router = express.Router();
const {
  getAllSubfields,
  getSubfieldById,
  createSubfield,
  updateSubfield,
  deleteSubfield,
  AddYearToSubfield,
} = require("../controllers/subFieldsController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");

// /api/subfields
router.get("/", getAllSubfields);

// /api/subfields/:id
router.get("/:id", getSubfieldById);

// /api/subfields
router.post("/", verifyToken, verifyTokenAndAdmin, createSubfield);


// /api/subfields/:id
router.put("/:id", verifyToken, verifyTokenAndAdmin, updateSubfield);
// /api/subfields/:id
router.put(
  "/:id/addyeartosubfield",
  verifyToken,
  verifyTokenAndAdmin,
  AddYearToSubfield
);

// /api/subfields/:id
router.delete("/:id", verifyToken, verifyTokenAndAdmin, deleteSubfield);


module.exports = router;
