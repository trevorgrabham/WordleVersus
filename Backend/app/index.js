const express = require("express");
const errorHandler = require("express-error-handler");
const playerRouter = require("./api/player");
const gameRouter = require("./api/game");
const gameStatRouter = require("./api/gamestat");

const app = express();

app.use(express.json());
app.use(errorHandler());

app.use("/player", playerRouter);
app.use("/game", gameRouter);
app.use("/gamestat", gameStatRouter);

module.exports = app;
