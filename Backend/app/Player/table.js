const pool = require("../../databasePool");

/**
 * A collection of functions for interacting with the player table
 * @class
 */
class PlayerTable {
  /**
   *
   * @param {sting} username - REQUIRED
   * @param {sting} email - REQUIRED
   * @throws {Error} Throws an error if a parameter is undefined or if unable to insert player into the table
   * @returns {Object} Returns the inserted player on success. The player will now have an id set for them
   */
  static async insertPlayer({ username, email }) {
    if (username === undefined)
      return new Error("username field must be provided");
    if (email === undefined) return new Error("email field must be provided");

    let availabilityCheckResponse = await pool.query(
      "SELECT username, email FROM player WHERE username=$1 OR email=$2",
      [username, email]
    );
    let { emailTaken, usernameTaken } = this.formatDataCheckResponse({
      response: availabilityCheckResponse,
      email,
      username,
    });
    let responseObject = {
      emailTaken: emailTaken,
      usernameTaken: usernameTaken,
      data: null,
    };
    if (emailTaken || usernameTaken) return responseObject;

    let insertResponse = await pool.query(
      'INSERT INTO player ("username", "email") VALUES($1, $2) RETURNING *',
      [username, email]
    );
    console.log(insertResponse);
    responseObject.data = insertResponse.rows[0];
    return responseObject;
  }

  /**
   *
   * @param {string} partialString - The input so far, that we want to get auto-complete suggestions for
   * @returns {Array<Object>} Returns an array of objects that match the string. The objects only have a 'username' field
   */
  static async searchPlayersFromPartial(partialString) {
    if (!partialString) return new Error("Partial string should not be empty");

    let autoCompleteResponse = await pool.query(
      "SELECT username FROM player WHERE username LIKE $1",
      [partialString + "%"]
    );
    return autoCompleteResponse.rows;
  }

  static formatDataCheckResponse({ response, username, email }) {
    if (response.rowCount === 0)
      return {
        emailTaken: false,
        usernameTaken: false,
      };

    if (response.rowCount > 1)
      return {
        emailTaken: true,
        usernameTaken: true,
      };

    if (response.rows[0].email === email)
      return {
        emailTaken: true,
        usernameTaken: false,
      };

    if (response.rows[0].username === username)
      return {
        emailTaken: false,
        usernameTaken: true,
      };
  }
}

module.exports = PlayerTable;
