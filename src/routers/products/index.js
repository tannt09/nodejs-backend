const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { asyncHandler } = require("../../commons/helps/asyncHandler");
const {
  getAll,
  update,
  add,
  deleteProduct,
} = require("../../controllers/product.controller");

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  const tokenParts = token ? token.split(" ") : [];
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(403).send("Token is required");
  }

  jwt.verify(tokenParts[1], process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }

    req.user = decoded;
    next();
  });
}

const router = express.Router();

const routers = [
  { method: 'get', path: '/getAll', handler: getAll},
  { method: 'put', path: '/update', handler: update},
  { method: 'post', path: '/add', handler: add},
  { method: 'delete', path: '/delete', handler: deleteProduct},
];

routers.forEach(route => {
  router[route.method](route.path, verifyToken, asyncHandler(route.handler));
})

// router.get("/getAll", verifyToken, asyncHandler(getAll));

// router.put("/update", verifyToken, asyncHandler(update));

// router.post("/add", verifyToken, asyncHandler(add));

// router.delete("/delete", verifyToken, asyncHandler(deleteProduct));

module.exports = router;
