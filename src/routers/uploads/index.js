const express = require("express");
const multer = require("multer");
const path = require("path");


const { asyncHandler } = require("../../commons/helps/asyncHandler");
const { uploadImage } = require("../../controllers/uploads.controller");

const uploadsDir = path.join("src", "images");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/image", upload.single("image"), asyncHandler(uploadImage));

module.exports = router;
