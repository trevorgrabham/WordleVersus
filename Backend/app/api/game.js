const { Router } = require("express");
const Game = require("../Game/Game");
const GameTable = require("../Game/table");
const Sanitizer = require("../../Sanitizer");
const logger = require("../../Logs/logger");

const router = new Router();

router.post("/new", (req, res, next) => {
  const data = req.body;
  let dataString = Object.keys(data)
    .map((key) => `${key}: ${data[key]}`)
    .join(", ");

  logger.info(`POST request to GameRouter/new with data (${dataString})`);

  const errors = sanitizeNewRoute(data);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(
      `User data error from GameRouter/new endpoint: ${errorString}`
    );
    return next(new Error(errorString));
  }

  GameTable.insertGame(data)
    .then((insertedRow) => {
      const insertedGame = new Game(insertedRow);
      logger.info(`Successful INSERT for Game ${insertedGame}`);
      res.json({ game: insertedGame });
    })
    .catch((err) => {
      logger.error(
        `Error INSERT into Game table unsuccessful using (${dataString}). ${err.message}`
      );
      next(err);
    });
});

router.get("/id/:gameId", (req, res, next) => {
  const gameId = req.params.gameId;

  logger.info(`GET request for game with id: ${gameId}`);

  const errors = sanitizeGameId(gameId);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(
      `Error with GET request from Game tablue using gameId: ${gameId}`
    );
    return next(new Error(errorString));
  }

  GameTable.selectGame({ id: gameId })
    .then((requestedRow) => {
      if (!requestedRow) {
        logger.info(
          `SELECT returned empty from Game table for gameId: ${gameId}`
        );
        return res.json({ game: null });
      }
      const requestedGame = new Game(requestedRow);
      logger.info(`SELECT successful returning game: ${requestedGame}`);
      res.json({ game: requestedGame });
    })
    .catch((err) => {
      logger.error(`Error during SELECT query on Game table. ${err.message}`);
      next(err);
    });
});

router.get("/pid/:playerId", (req, res, next) => {
  const playerId = req.params.playerId;

  logger.info(`GET request for games involving player with id: ${playerId}`);

  const errors = sanitizePlayerId(playerId);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(`Error with playerId: ${playerId}`);
    return next(new Error(errorString));
  }

  GameTable.selectGame({ player: playerId })
    .then((requestedGames) => {
      const games = requestedGames.map(
        (requestedGame) => new Game(requestedGame)
      );
      let gamesString = "["
        .concat(games.map((game) => game.toString()).join(", "))
        .concat("]");
      logger.info(`GET successful for player ${playerId}. ${gamesString}`);
      res.json({ games: games });
    })
    .catch((err) => {
      logger.error(`Error during SELECT query. ${err.message}`);
      next(err);
    });
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
    return e.message;
  }
  return;
}
