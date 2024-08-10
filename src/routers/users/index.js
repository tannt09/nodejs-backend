const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { Client } = require("pg");
const { asyncHandler } = require("../../commons/helps/asyncHandler");
const { testAsync } = require("../../controllers/user.controller");

const router = express.Router();

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "123456",
  port: 5432,
});
client.connect();
client.query("SELECT name, email FROM users", (err, res) => {
  if (err) {
    console.log(err);
  } else {
    // console.log(res.rows);
    console.log("Query successfully");
  }23
});

router.get("/test", asyncHandler(testAsync));

router.get("/getAll", (req, res) => {1
  client.query("SELECT id, name, email FROM users", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(result.rows);
    }
  });
});

router.put("/:id", (req, res) => {
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
});

router.post("/add", (req, res) => {
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
});

router.delete("/delete/:id", (req, res) => {
  const userId = req.params.id;

  client.query("DELETE FROM users WHERE id = $1", [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error delete user");
    } else {
      res.send("Delete user successfully");
    }
  });
});

module.exports = router;
