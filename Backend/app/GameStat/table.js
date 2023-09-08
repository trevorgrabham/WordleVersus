const pool = require("../../databasePool");

/**
 * A collection of functions for interacting with the gamestat table
 * @class
 */
class GameStatTable {
  /**
   *
   * @param {int} gameId - REQUIRED
   * @param {int} playerId - REQUIRED
   * @param {int} numCorrectWordsGuessed - REQUIRED
   * @param {int} numGuessesTotal - REQUIRED
   * @throws {Error} Throws and error if a parameter is not defined or if unable to insert entry into the table
   * @returns {Object} Returns the entry that was just entered into the table on success
   */
  static async insertGameStat({
    gameId,
    playerId,
    numCorrectWordsGuessed,
    numGuessesTotal,
  }) {
    if (!gameId) new Error("Missing field: gameId");
    if (!playerId) new Error("Missing field: playerId");
    if (!numCorrectWordsGuessed)
      new Error("Missing field: numCorrectWordsGuessed");
    if (!numGuessesTotal) new Error("Missing field: numGuessesTotal");

    let result = await pool.query(
      "INSERT INTO gamestat VALUES($1, $2, $3, $4) RETURNING *",
      [gameId, playerId, numCorrectWordsGuessed, numGuessesTotal]
    );
    return result.rows[0];
  }
}

module.exports = GameStatTable;
