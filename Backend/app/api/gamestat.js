const { Router } = require("express");
const GameStatTable = require("../GameStat/table");
const Sanitizer = require("../../Sanitizer");
const logger = require("../../Logs/logger");

const router = new Router();

// Returns {error: true, message, target} on failure
// Returns {error: false, gameStat} on success
router.post("/new", (req, res) => {
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
    return res.json({
      error: true,
      message: errorString,
      target: "/gamestat/new",
    });
  }

  GameStatTable.insertGameStat(data)
    .then((insertedRow) => {
      logger.info(
        `Successful INSERT for GameStat (${Object.keys(insertedRow).map(
          (key) => `${key}:${insertedRow[key]}`
        )})`
      );
      return res.json({ error: false, gameStat: insertedRow });
    })
    .catch((err) => {
      logger.error(
        `Error INSERT into GameStat table unsuccessful using (${dataString}).`
      );
      return res.json({
        error: true,
        message: err.message,
        target: "/gamestat/new",
      });
    });
});

module.exports = router;

function sanitizeNewRoute(data) {
  try {
    const gameIdSanitizer = new Sanitizer(data.gameId).sanitize().validateInt();
    if (!gameIdSanitizer.isValid()) return gameIdSanitizer.checkErrors();
  } catch (e) {
    return [`gameId not provided`];
  }
  try {
    const playerIdSanitizer = new Sanitizer(data.playerId)
      .sanitize()
      .validateInt();
    if (!playerIdSanitizer.isValid()) return playerIdSanitizer.checkErrors();
  } catch (e) {
    return [`playerId not provided`];
  }
  try {
    const numCorrectWordsGuessedSanitizer = new Sanitizer(
      data.numCorrectWordsGuessed
    )
      .sanitize()
      .validateInt();
    if (!numCorrectWordsGuessedSanitizer.isValid())
      return numCorrectWordsGuessedSanitizer.checkErrors();
  } catch (e) {
    return ["numCorrectWordsGuessed not provided"];
  }
  try {
    const numGuessesTotalSanitizer = new Sanitizer(data.numGuessesTotal)
      .sanitize()
      .validateInt();
    if (!numGuessesTotalSanitizer.isValid())
      return numGuessesTotalSanitizer.checkErrors();
  } catch (e) {
    return ["numGuessesTotal not provided"];
  }
  return;
}
