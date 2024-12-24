const { v4: uuidv4 } = require("uuid");
const { client } = require("../databases/init.pg");

class UserController {
  async getProfile(req, res, ___) {
    const userId = req.query.user_id;

    client.query(
      "SELECT * FROM user_profile WHERE user_id = $1",
      [userId],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error fetching data");
        } else {
          res.status(200).json({
            id: result.rows[0].id,
            user_id: result.rows[0].user_id,
            full_name: result.rows[0].full_name,
            email: result.rows[0].email,
            phone_number: result.rows[0].phone_number,
            username: result.rows[0].username,
            date_of_birth: result.rows[0].date_of_birth,
            gender: result.rows[0].gender,
            region: result.rows[0].region,
          });
        }
      }
    );
  }

  async updateProfile(req, res, ___) {
    const userId = req.query.user_id;
    const newData = req.body;

    const updateFields = [];
    const values = [userId];
    let paramCounter = 2;

    for (const [key, value] of Object.entries(newData)) {
      if (value != null && value !== undefined && value !== "") {
        updateFields.push(`${key} = $${paramCounter}`);
        values.push(value);
        paramCounter++;
      }
    }

    const queryText = `UPDATE user_profile SET ${updateFields.join(
      ", "
    )} WHERE user_id = $1`;

    client.query(queryText, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating user profile");
      } else {
        res.send("Updated user profile successfully");
      }
    });
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
