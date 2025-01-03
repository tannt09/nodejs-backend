const express = require("express");

const { asyncHandler } = require("../../commons/helps/asyncHandler");
const { register, login, refreshToken, googleLogin } = require("../../controllers/auth.controller");

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/refresh", asyncHandler(refreshToken));
router.post("/googleLogin", asyncHandler(googleLogin));

module.exports = router;
