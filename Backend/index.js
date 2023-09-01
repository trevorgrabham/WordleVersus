const { Pool } = require("pg");
const express = require("express");

require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

app.get("/", (req, res) => {});

app.listen(port, () => {
  console.log("Server running on port ${port}...");
});
