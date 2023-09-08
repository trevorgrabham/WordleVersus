const { Router } = require("express");
const Game = require("../Game/Game");
const GameTable = require("../Game/table");
const Sanitizer = require("../../Sanitizer");

const router = new Router();

router.post("/new", (req, res) => {
  const data = req.body;

  const errors = sanitizeNewRoute(data);
  if (errors) return res.send(errors);

  GameTable.insertGame(data)
    .then((insertedRow) => {
      res.json({ game: new Game(insertedRow) });
    })
    .catch((err) => console.error(err));
});

router.get("/id/:gameId", (req, res) => {
  const gameId = req.params.gameId;

  const errors = sanitizeGameId(gameId);
  if (errors) return res.send(errors);

  GameTable.selectGame({ id: gameId })
    .then((requestedGame) => {
      if (!requestedGame) return res.send("No games with that id");
      res.json({ game: new Game(requestedGame) });
    })
    .catch((err) => console.error(err));
});

router.get("/pid/:playerId", (req, res) => {
  const playerId = req.params.playerId;

  const errors = sanitizePlayerId(playerId);
  if (errors) return res.send(errors);

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

function sanitizeNewRoute(data) {
  try {
    const creationSanitizer = new Sanitizer(data?.creationDatetime).sanitize();
    if (!creationSanitizer.isValid()) return creationSanitizer.checkErrors();
  } catch (e) {
    // pass
    // creationDatetime is allowed to be undefined
  }
  try {
    const p1Sanititzer = new Sanitizer(data.p1id).sanitize().validateInt();
    if (!p1Sanititzer.isValid()) return p1Sanititzer.checkErrors();

    const p2Sanititzer = new Sanitizer(data.p2id).sanitize().validateInt();
    if (!p2Sanititzer.isValid()) return p2Sanititzer.checkErrors();

    const winnerSanititzer = new Sanitizer(data.winner)
      .sanitize()
      .validateInt();
    if (!winnerSanititzer.isValid()) return winnerSanititzer.checkErrors();
  } catch (e) {
    console.error(e);
    return [e.message];
  }
  return;
}

function sanitizeGameId(gameId) {
  try {
    const idSanitizer = new Sanitizer(gameId).sanitize().validateInt();
    if (!idSanitizer.isValid()) return idSanitizer.checkErrors();
  } catch (e) {
    return e.message;
  }
  return;
}

function sanitizePlayerId(playerId) {
  try {
    const idSanitizer = new Sanitizer(playerId).sanitize().validateInt();
    if (!idSanitizer.isValid()) return idSanitizer.checkErrors();
  } catch (e) {
    e.message;
  }
  return;
}
