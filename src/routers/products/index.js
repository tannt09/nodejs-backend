const express = require("express");

const { asyncHandler } = require("../../commons/helps/asyncHandler");
const { getAll, update, add } = require("../../controllers/product.controller");

const router = express.Router();

router.get("/getAll", asyncHandler(getAll));

router.put("", asyncHandler(update));

router.post("/add", asyncHandler(add));

module.exports = router;
