const pool = require("../../databasePool");

/**
 * A collection of functions for interacting with the game table
 * @class
 */
class GameTable {
  /**
   *
   * @param {string} creationDatetime - optionally supplied. The ISOString of a Date object
   * @param {int} p1id - REQUIRED: id of player 1
   * @param {int} p2id - REQUIRED: id of player 2
   * @param {int} winner - REQUIRED: id of the winning player
   * @throws {Error} Throws an error if unable to insert Game into the table, or if a REQUIRED: field is not defined
   * @returns {object} Returns an object of the Game that was just inserted into the table. The id field for the game will now be filled out
   */
  static async insertGame({ creationDatetime, p1id, p2id, winner }) {
    if (!creationDatetime) creationDatetime = new Date();

    if (!p1id) return Promise.reject("Missing field: p1id");
    if (!p2id) return Promise.reject("Missing field: p2id");
    if (!winner) return Promise.reject("Missing field: winner");

    let response = await pool.query(
      'INSERT INTO game ("creationDatetime", "p1id", "p2id", winner) VALUES($1, $2, $3, $4) RETURNING *',
      [creationDatetime, p1id, p2id, winner]
    );
    return response.rows[0];
  }

  /**
   *
   * Only one of `id` or `player` should be supplied
   * @param {int} id - The game id that is to be retreived
   * @param {int} player - The player id that is to be retreived
   * @throws {Error} Throws and error if unable to query the database or either too many, or no paramters are supplied.
   * @returns {Object | Array<Object>} If id, then returns the game with a matching id. If player then returns a list of all games that the player with the corresponding id is involved.
   */
  static async selectGame({ id, player }) {
    if (!id && !player)
      return Promise.reject("Must define one of id or player");

    if (id && player)
      return Promise.reject(
        "This function was not meant to take multiple paramerters"
      );

    if (id) {
      let result = await pool.query("SELECT * FROM game WHERE id=$1", [id]);
      return result.rows[0];
    }

    if (player) {
      let result = await pool.query(
        'SELECT * FROM game WHERE "p1id"=$1 OR "p2id"=$1',
        [player]
      );
      return result.rows;
    }
  }
}

module.exports = GameTable;
