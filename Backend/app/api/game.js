const { Router } = require("express");
const GameTable = require("../Game/table");
const Sanitizer = require("../../Sanitizer");
const logger = require("../../Logs/logger");

const router = new Router();

// Returns {error: true, message, target} on failure
// Returns {error: false, game} on success
router.post("/new", (req, res) => {
  const data = req.body;
  let dataString = Object.keys(data)
    .map((key) => `${key}: ${data[key]}`)
    .join(", ");

  logger.info(`POST request to game/new with data (${dataString})`);

  const errors = sanitizeNewRoute(data);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(
      `User data error from GameRouter/new endpoint: ${errorString}`
    );
    return res.json({ error: true, message: errorString, target: "/game/new" });
  }

  GameTable.insertGame(data)
    .then((insertedRow) => {
      logger.info(
        `Successful INSERT for Game (${Object.keys(insertedRow).map(
          (key) => `${key}:${insertedRow[key]}`
        )})`
      );
      return res.json({ error: false, game: insertedRow });
    })
    .catch((err) => {
      logger.error(
        `Error INSERT into Game table unsuccessful using (${dataString}). ${err.message}`
      );
      return res.json({
        error: true,
        message: err.message,
        target: "/game/new",
      });
    });
});

// Returns {error: true, message, target} on failure
// Returns {error: false, game} on success
router.get("/id/:gameId", (req, res) => {
  const gameId = req.params.gameId;

  logger.info(`GET request for game with id: ${gameId}`);

  const errors = sanitizeGameId(gameId);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(
      `Error with GET request from Game tablue using gameId: ${gameId}`
    );
    return res.json({ error: true, message: errorString, target: "/game/id" });
  }

  GameTable.selectGame({ id: gameId })
    .then((requestedRow) => {
      if (!requestedRow) {
        logger.info(
          `SELECT returned empty from Game table for gameId: ${gameId}`
        );
        return res.json({ error: false, game: null });
      }
      logger.info(
        `SELECT successful returning game: (${Object.keys(requestedRow).map(
          (key) => `${key}:${requestedRow[key]}`
        )})`
      );
      return res.json({ error: false, game: requestedRow });
    })
    .catch((err) => {
      logger.error(`Error during SELECT query on Game table. ${err.message}`);
      return res.json({
        error: true,
        message: err.message,
        target: "/game/id",
      });
    });
});

// Returns {error: true, message, target} on failure
// Returns {error: false, [games]} on success
router.get("/pid/:playerId", (req, res) => {
  const playerId = req.params.playerId;

  logger.info(`GET request for games involving player with id: ${playerId}`);

  const errors = sanitizePlayerId(playerId);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(`Error with playerId: ${playerId}`);
    return res.json({ error: true, message: errorString, target: "/game/pid" });
  }

  GameTable.selectGame({ player: playerId })
    .then((requestedGames) => {
      let gamesString = `[${requestedGames
        .map(
          (game) => `{${Object.keys(game).map((key) => `${key}:${game[key]}`)}}`
        )
        .join("\n")}]`;
      logger.info(`GET successful for player ${playerId}.\n${gamesString}`);
      return res.json({ error: false, games: requestedGames });
    })
    .catch((err) => {
      logger.error(`Error during SELECT query. ${err.message}`);
      return res.json({
        error: true,
        message: err.message,
        target: "/game/pid",
      });
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
  } catch (e) {
    return ["p1id not provided"];
  }
  try {
    const p2Sanititzer = new Sanitizer(data.p2id).sanitize().validateInt();
    if (!p2Sanititzer.isValid()) return p2Sanititzer.checkErrors();
  } catch (e) {
    return ["p2id not provided"];
  }
  try {
    const winnerSanititzer = new Sanitizer(data.winner)
      .sanitize()
      .validateInt();
    if (!winnerSanititzer.isValid()) return winnerSanititzer.checkErrors();
  } catch (e) {
    return ["winner not provided"];
  }
  return;
}

function sanitizeGameId(gameId) {
  try {
    const idSanitizer = new Sanitizer(gameId).sanitize().validateInt();
    if (!idSanitizer.isValid()) return idSanitizer.checkErrors();
  } catch (e) {
    return ["gameId not provided"];
  }
  return;
}

function sanitizePlayerId(playerId) {
  try {
    const idSanitizer = new Sanitizer(playerId).sanitize().validateInt();
    if (!idSanitizer.isValid()) return idSanitizer.checkErrors();
  } catch (e) {
    return ["playerId not provided"];
  }
  return;
}
