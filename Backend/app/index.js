const { Pool } = require("pg");
const express = require("express");
const userRouter = require("./api/user");

const app = express();

app.use("/user", userRouter);

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true,
// });

// pool
//   .connect()
//   .then(() => console.log("Success: Connected to the database"))
//   .catch((err) =>
//     console.error("Failure: Unable to connect to the database.\n", err)
//   );

module.exports = app;
