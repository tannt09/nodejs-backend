const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const router = express.Router();
router.use("/users", require("./users"));

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});