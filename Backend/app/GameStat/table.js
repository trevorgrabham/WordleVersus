const pool = require("../../databasePool");

class GameStatTable {
  static insertGameStat({
    gameId,
    playerId,
    numCorrectWordsGuessed,
    numGuessesTotal,
  }) {
    return new Promise((resolve, reject) => {
      if (gameId === undefined) reject(new Error("Missing field: gameId"));
      if (playerId === undefined) reject(new Error("Missing field: playerId"));
      if (numCorrectWordsGuessed === undefined)
        reject(new Error("Missing field: numCorrectWordsGuessed"));
      if (numGuessesTotal === undefined)
        reject(new Error("Missing field: numGuessesTotal"));

      pool.query(
        "INSERT INTO gamestat VALUES($1, $2, $3, $4) RETURNING *",
        [gameId, playerId, numCorrectWordsGuessed, numGuessesTotal],
        (err, res) => {
          if (err) return reject(err);
          resolve(res.rows[0]);
        }
      );
    });
  }
}

module.exports = GameStatTable;
