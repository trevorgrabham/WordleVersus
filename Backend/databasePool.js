const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

module.exports = pool;

pool.query("Select * from player", (e, res) => {
  if (e) return console.log(e);
  console.log(res.rows);
});
