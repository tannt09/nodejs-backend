const bcrypt = require("bcryptjs");
const { client } = require("../databases/init.pg");

class CustomerController {
  async register(req, res, ___) {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const queryText =
      "INSERT INTO customers (username, email, password) VALUES ($1, $2, $3) RETURNING *";

    client.query(
      queryText,
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error register customers");
        } else {
          res.send("Register customers successfully");
        }
      }
    );
  }
}
