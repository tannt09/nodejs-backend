const express = require("express");

const { asyncHandler } = require("../../commons/helps/asyncHandler");
const {
  getAll,
  update,
  add,
  deleteProduct,
} = require("../../controllers/product.controller");

const router = express.Router();

router.get("/getAll", asyncHandler(getAll));

router.put("/update", asyncHandler(update));

router.post("/add", asyncHandler(add));

router.delete("/delete", asyncHandler(deleteProduct));

module.exports = router;
