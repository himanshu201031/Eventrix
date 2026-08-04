const express = require("express");
const router = express.Router();
const {register, login,verifyotp} = require("../controllers/authController.js");

router.post("/register", register);
router.post("/login", login);
router.post("/verifyotp", verifyotp);

module.exports = router;
