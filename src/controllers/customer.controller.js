const bcrypt = require("bcryptjs");
const { client } = require("../databases/init.pg");

class CustomerController {
  async register(req, res, ___) {
    const { username, email, password } = req.body;

    // Check if username already exists
    const checkUsernameQuery = "SELECT * FROM customers WHERE username = $1";
    try {
      const usernameCheck = await client.query(checkUsernameQuery, [username]);
      if (usernameCheck.rows.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // If username doesn't exist, proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = "INSERT INTO customers (username, email, password) VALUES ($1, $2, $3) RETURNING *";
      const result = await client.query(insertQuery, [username, email, hashedPassword]);

      res.status(201).json({ message: "Customer registered successfully", customer: result.rows[0].username });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error registering customer" });
    }
  }
}

module.exports = new CustomerController();
