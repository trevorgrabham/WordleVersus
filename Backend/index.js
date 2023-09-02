const { Pool } = require("pg");
const express = require("express");

require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

pool
  .connect()
  .then(() => console.log("Success: Connected to the database"))
  .catch((err) =>
    console.error("Failure: Unable to connect to the database.\n", err)
  );

app.get("/", (req, res) => {
  console.log();
});

app.listen(port, () => {
  console.log("Server running on port ${port}...");
});
