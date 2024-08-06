const express = require("express");
const { Client } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({
  user: '',
  host: '',
  database: '',
  password: '',
  port: 5432
});

client.connect();

client.query('SELECT name, email FROM users', (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log(res.rows);
  }
  client.end()
})

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/users', (req, res) => {
  client.query('SELECT name, email FROM users', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(result.rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
