const express = require("express");

const { asyncHandler } = require("../../commons/helps/asyncHandler");
const { getAll } = require("../../controllers/product.controller");

const router = express.Router();

router.get("/getAll", asyncHandler(getAll));

module.exports = router;
