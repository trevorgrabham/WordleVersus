const { Pool } = require("pg");
const express = require("express");
const playerRouter = require("./api/player");
const gameRouter = require("./api/game");

const app = express();

app.use("/player", playerRouter);
app.use("/game", gameRouter);

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
