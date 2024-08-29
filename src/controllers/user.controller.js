const { v4: uuidv4 } = require("uuid");
const { client } = require("../databases/init.pg");

class UserController {
  async getAll(req, res, ___) {
    client.query("SELECT id, name, email FROM users", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
      } else {
        res.json(result.rows);
      }
    });
  }
  
  async update(req, res, ___) {
    const userId = req.params.id;
    const newName = req.body.name;

    client.query(
      "UPDATE users SET name = $1 WHERE id = $2",
      [newName, userId],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error updating data");
        } else {
          res.send("User name updated successfully");
        }
      }
    );
  }

  async add(req, res, ___) {
    const newId = uuidv4();
    const newName = req.body.name;
    const newEmail = req.body.email;

    client.query(
      "INSERT INTO users (id, name, email) VALUES ($1, $2, $3)",
      [newId, newName, newEmail],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error add new user");
        } else {
          res.send("Add new user successfully");
        }
      }
    );
  }

  async deleteUser(req, res, ___) {
    const userId = req.params.id;

    client.query("DELETE FROM users WHERE id = $1", [userId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error delete user");
      } else {
        res.send("Delete user successfully");
      }
    });
  }
}

module.exports = new UserController();
