const express = require("express");
const authController = require("../controllers/authController");
const otpController = require("../controllers/otpController");
const userController= require("../controllers/userController")
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify-otp", otpController.verifyOtp);
router.post("/signin", authController.signin);
router.route("/customers").get(userController.getAllUsers);

module.exports = router;
