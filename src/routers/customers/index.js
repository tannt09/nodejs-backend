const express = require("express");

const { asyncHandler } = require("../../commons/helps/asyncHandler");

const router = express.Router();

router.get("/register", asyncHandler())

module.exports = router;