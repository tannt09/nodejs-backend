const { Client, Pool } = require("pg");

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

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "123456",
  port: 5432,
  min: 5,
  max: 10,
  acquireTimeoutMillis: 30000,
  createTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  reapIntervalMillis: 1000,
});

pool
  .connect()
  .then((pool) => {
    console.log("CONNECTED TO POSTGRESQL SUCCESS !!");
  })
  .catch((error) => {
    console.error("Failed to connect to PostgreSQL database", error);
  });

module.exports.client = client;
module.exports.pool = pool;
