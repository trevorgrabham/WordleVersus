const { Router } = require("express");
const Game = require("../Game/Game");
const GameTable = require("../Game/table");

const router = new Router();

router.post("/new", (req, res) => {
  const data = req.body;

  GameTable.insertGame(data)
    .then((insertedRow) => {
      res.json({ game: new Game(insertedRow) });
    })
    .catch((err) => console.error(err));
});

router.get("/id/:gameId", (req, res) => {
  const gameId = req.params.gameId;

  GameTable.selectGame({ id: gameId })
    .then((requestedGame) => {
      res.json({ game: new Game(requestedGame) });
    })
    .catch((err) => console.error(err));
});

router.get("/pid/:playerId", (req, res) => {
  const playerId = req.params.playerId;

  GameTable.selectGame({ player: playerId })
    .then((requestedGames) => {
      const games = requestedGames.map(
        (requestedGame) => new Game(requestedGame)
      );
      res.json({ games: games });
    })
    .catch((err) => console.error(err));
});

module.exports = router;
