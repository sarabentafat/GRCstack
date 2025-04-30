const router = require("express").Router();
const { getAllLevelsCtrl, createLevel, getLevelById } = require("../controllers/levelController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

//   /api/levels
router.route("/").get(getAllLevelsCtrl);
//   /api/levels
router.route("/").post(verifyTokenAndAdmin,createLevel)

// /api/levels/:id
router.route("/:id").get(getLevelById);

module.exports = router;
