const { Router } = require("express");
const GameStat = require("../GameStat/GameStat");
const GameStatTable = require("../GameStat/table");
const Sanitizer = require("../../Sanitizer");

const router = new Router();

router.post("/new", (req, res) => {
  const data = req.body;

  const errors = sanitizeNewRoute(data);
  if (errors) return res.send(errors);

  GameStatTable.insertGameStat(data)
    .then((enteredGameStat) => {
      return res.json({ gameStat: new GameStat(enteredGameStat) });
    })
    .catch((err) => {
      console.error(err);
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
