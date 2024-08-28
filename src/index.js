const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const router = express.Router();
router.use("/users", require("./routers/users"));
router.use("/products", require("./routers/products"));

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
