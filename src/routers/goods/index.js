const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { asyncHandler } = require("../../commons/helps/asyncHandler");
const {
  getAll,
  add,
  changeFavorite,
  getFeatured,
  getMostPopular,
  getSearchResult,
  getItemDetail,
} = require("../../controllers/goods.controller");

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
  { method: "get", path: "/getAll", handler: getAll },
  { method: "get", path: "/getFeatured", handler: getFeatured },
  { method: "get", path: "/getMostPopular", handler: getMostPopular },
  { method: "get", path: "/searchProduct", handler: getSearchResult },
  { method: "get", path: "/getItemDetail", handler: getItemDetail },
  { method: "post", path: "/add", handler: add },
  { method: "put", path: "/changeFavorite", handler: changeFavorite },
];

routers.forEach((route) => {
  router[route.method](route.path, verifyToken, asyncHandler(route.handler));
});

module.exports = router;
