const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "123456",
  port: 5432,
});

client
  .connect()
  .then((client) => {
    console.log("CONNECTED TO POSTGRESQL SUCCESS !!");
  })
  .catch((error) => {
    console.error("Failed to connect to PostgreSQL database", error);
  });

module.exports = client;
