const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3000;
const uploadsDir = path.join(__dirname, "images");

const app = express();
app.use(express.json());

const router = express.Router();
router.use("/users", require("./routers/users"));
router.use("/products", require("./routers/products"));
router.use("/auth", require("./routers/auth"));
router.use("/uploads", require("./routers/uploads"));
router.use("/goods", require("./routers/goods"));

app.use("/images", express.static(uploadsDir));
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
