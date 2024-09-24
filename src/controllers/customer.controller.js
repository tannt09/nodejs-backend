require("dotenv").config(); // Add this line at the top

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { client } = require("../databases/init.pg");

class CustomerController {
  async register(req, res) {
    const { username, email, password } = req.body;

    try {
      // Check if username already exists
      const usernameCheck = await client.query(
        "SELECT 1 FROM customers WHERE username = $1",
        [username]
      );
      if (usernameCheck.rows.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // If username doesn't exist, proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await client.query(
        "INSERT INTO customers (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, hashedPassword]
      );

      res.status(201).json({
        message: "Customer registered successfully",
        customer: result.rows[0].username,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error registering customer" });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;

    try {
      // Check if username exists
      const userCheck = await client.query(
        "SELECT * FROM customers WHERE username = $1",
        [username]
      );
      if (userCheck.rows.length === 0) {
        return res.status(400).json({ error: "Invalid username or password" });
      }

      const user = userCheck.rows[0];
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid username or password" });
      }

      // Generate a token (you'll need to implement token generation)
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      ); // Replace with actual token generation logic

      res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error logging in" });
    }
  }
}

module.exports = new CustomerController();
