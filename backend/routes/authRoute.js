const router = require("express").Router();
const {
  registerUserCtrl,
  loginUserCtrl,
  verifyUserAccountCtrl,
  refreshToken,
  checkEmailAndUsername,
  checkAccountVerified,
  forgotPasswordCtrl,
  resetPasswordCtrl,
  changePasswordCtrl,
} = require("../controllers/authController");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

//   /api/auth/register
router.post("/register", registerUserCtrl);
//   /api/auth/check-email-username
router.post("/check-email-username", checkEmailAndUsername);

router.post('/forgot-password',forgotPasswordCtrl)
router.put("/reset-password/:resetToken", resetPasswordCtrl);
router.put("/change-password",verifyTokenAndAuthorization,changePasswordCtrl);

// /api/auth/login
router.post("/login", loginUserCtrl);

// /api/auth/:userId/verify/:token
router.get("/:userId/verify/:token", verifyUserAccountCtrl);

// /api/auth/refresh-token
router.get("/refresh-token", refreshToken); // Use the refreshLoginToken function as the callback for refreshing the token



module.exports = router;
