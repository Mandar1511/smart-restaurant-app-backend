const express = require("express");
const staffController= require("../controllers/staffController")
const router = express.Router();

router.post("/signup", staffController.signup);
router.post("/signin", staffController.signin);

module.exports = router;
