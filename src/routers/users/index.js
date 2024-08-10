const express = require("express");

const { asyncHandler } = require("../../commons/helps/asyncHandler");
const { getAll, update, add, deleteUser } = require("../../controllers/user.controller");

const router = express.Router();

router.get("/getAll", asyncHandler(getAll));

router.put("/:id", asyncHandler(update));

router.post("/add", asyncHandler(add));

router.delete("/delete/:id", asyncHandler(deleteUser));

module.exports = router;
