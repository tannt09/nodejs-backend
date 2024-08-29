const express = require("express");

const { asyncHandler } = require("../../commons/helps/asyncHandler");
const { getAll, update } = require("../../controllers/product.controller");

const router = express.Router();

router.get("/getAll", asyncHandler(getAll));

router.put("", asyncHandler(update));

module.exports = router;
