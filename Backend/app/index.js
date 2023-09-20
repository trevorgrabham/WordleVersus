const express = require("express");
const cors = require("cors");
const http = require("http");
const errorHandler = require("express-error-handler");
const initializeIO = require("./socket");
const playerRouter = require("./api/player");
const gameRouter = require("./api/game");
const gameStatRouter = require("./api/gamestat");

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:8080",
  })
);
app.use(express.json());
app.use(errorHandler());

app.use("/player", playerRouter);
app.use("/game", gameRouter);
app.use("/gamestat", gameStatRouter);

const server = http.createServer(app);
const io = initializeIO(server);

module.exports = { server, io };
