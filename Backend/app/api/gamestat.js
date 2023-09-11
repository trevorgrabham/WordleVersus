const { Router } = require("express");
const GameStat = require("../GameStat/GameStat");
const GameStatTable = require("../GameStat/table");
const Sanitizer = require("../../Sanitizer");
const logger = require("../../Logs/logger");
const { insertGame } = require("../Game/table");

const router = new Router();

router.post("/new", (req, res, next) => {
  const data = req.body;

  let dataString = Object.keys(data)
    .map((key) => `${key}: ${data[key]}`)
    .join(", ");

  logger.info(`POST request to GameStat table with data (${dataString})`);

  const errors = sanitizeNewRoute(data);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(
      `User data error from GameStatRouter/new endpoint: ${errorString}`
    );
    return next(new Error(errorString));
  }

  GameStatTable.insertGameStat(data)
    .then((insertedRow) => {
      const insertedGameStat = new GameStat(insertedRow);
      logger.info(`Successful INSERT for GameStat ${insertedGameStat}`);
      return res.json({ gameStat: insertedGameStat });
    })
    .catch((err) => {
      logger.error(
        `Error INSERT into GameStat table unsuccessful using (${dataString}).`
      );
      next(err);
    });
});

module.exports = router;

function sanitizeNewRoute(data) {
  try {
    const gameIdSanitizer = new Sanitizer(data.gameId).sanitize().validateInt();
    if (!gameIdSanitizer.isValid()) return gameIdSanitizer.checkErrors();

    const playerIdSanitizer = new Sanitizer(data.playerId)
      .sanitize()
      .validateInt();
    if (!playerIdSanitizer.isValid()) return playerIdSanitizer.checkErrors();

    const numCorrectWordsGuessedSanitizer = new Sanitizer(
      data.numCorrectWordsGuessed
    )
      .sanitize()
      .validateInt();
    if (!numCorrectWordsGuessedSanitizer.isValid())
      return numCorrectWordsGuessedSanitizer.checkErrors();

    const numGuessesTotalSanitizer = new Sanitizer(data.numGuessesTotal)
      .sanitize()
      .validateInt();
    if (!numGuessesTotalSanitizer.isValid())
      return numGuessesTotalSanitizer.checkErrors();
  } catch (e) {
    return e.message;
  }
  return;
}
