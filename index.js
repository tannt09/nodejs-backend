const express = require("express");
const { Client } = require("pg");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123456',
  port: 5432
});

client.connect();

client.query('SELECT name, email FROM users', (err, res) => {
  if (err) {
    console.log(err);
  } else {
    // console.log(res.rows);
    console.log('Query successfully');
  }
  // client.end()
})

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/users', (req, res) => {
  client.query('SELECT id, name, email FROM users', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(result.rows);
    }
  });
});

app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const newName = req.body.name;

  client.query('UPDATE users SET name = $1 WHERE id = $2', [newName, userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating data');
    } else{
      res.send('User name updated successfully');
    }
  });
});

app.post('/users/add', (req, res) => {
  const newId = uuidv4();
  const newName = req.body.name;
  const newEmail = req.body.email;

  client.query('INSERT INTO users (id, name, email) VALUES ($1, $2, $3)', [newId, newName, newEmail], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error add new user');
    } else{
      res.send('Add new user successfully');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
