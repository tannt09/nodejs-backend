const express = require("express");

const { asyncHandler } = require("../../commons/helps/asyncHandler");
const { register } = require("../../controllers/customer.controller");

const router = express.Router();

router.post("/register", asyncHandler(register));

module.exports = router;
