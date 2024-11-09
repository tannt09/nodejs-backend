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
        return res
          .status(400)
          .json({ code: 400, message: "Username already exists" });
      }

      // If username doesn't exist, proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await client.query(
        "INSERT INTO customers (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, hashedPassword]
      );

      res.status(200).json({
        code: 200,
        message: "Customer registered successfully",
        data: { customer: result.rows[0].username },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ code: 500, message: err });
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
        return res
          .status(400)
          .json({ code: 400, message: "Invalid username or password" });
      }

      const user = userCheck.rows[0];
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ code: 400, message: "Invalid username or password" });
      }

      // Generate access token and refresh token
      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.TOKEN_SECRET,
        { expiresIn: "1m" }
      );

      const refreshToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      await client.query(
        "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
        [user.id, refreshToken]
      );

      res.status(200).json({
        code: 200,
        message: "Login successful",
        data: { access_token: accessToken, refresh_token: refreshToken },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ code: 500, message: err });
    }
  }

  async refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ code: 400, message: "Refresh token is required" });
    }

    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      // Check if refresh token exists in database
      const tokenCheck = await client.query(
        "SELECT * FROM refresh_tokens WHERE user_id = $1 AND token = $2",
        [decoded.id, refreshToken]
      );

      if (tokenCheck.rows.length === 0) {
        return res.status(401).json({ code: 401, message: "Invalid refresh token" });
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { id: decoded.id, username: decoded.username },
        process.env.TOKEN_SECRET,
        { expiresIn: "1m" }
      );

      // Generate new refresh token
      // const newRefreshToken = jwt.sign(
      //   { id: decoded.id, username: decoded.username },
      //   process.env.REFRESH_TOKEN_SECRET,
      //   { expiresIn: "7d" }
      // );

      // // Update refresh token in database
      // await client.query(
      //   "UPDATE refresh_tokens SET token = $1 WHERE user_id = $2 AND token = $3",
      //   [newRefreshToken, decoded.id, refresh_token]
      // );

      res.status(200).json({
        code: 200,
        message: "Token refreshed successfully",
        data: { access_token: accessToken },
      });
    } catch (err) {
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ code: 401, message: "Invalid refresh token" });
      }
      console.error(err);
      res.status(500).json({ code: 500, message: err });
    }
  }
}

module.exports = new CustomerController();
