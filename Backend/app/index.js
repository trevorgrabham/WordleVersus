const express = require("express");
const playerRouter = require("./api/player");
const gameRouter = require("./api/game");

const app = express();

app.use(express.json());

app.use("/player", playerRouter);
app.use("/game", gameRouter);

module.exports = app;
