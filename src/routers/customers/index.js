const express = require("express");

const { asyncHandler } = require("../../commons/helps/asyncHandler");
const { register, login } = require("../../controllers/customer.controller");

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

module.exports = router;
