const { response } = require("express");
const pool = require("../../databasePool");
const bcrypt = require("bcrypt");

const saltRounds = 10;

/**
 * A collection of functions for interacting with the player table
 * @class
 */
class PlayerTable {
  /**
   * @param {string} username - REQUIRED
   * @param {string} email - REQUIRED
   * @returns {Object} Returns the inserted player on success. The player will now have an id set for them
   */
  static async insertPlayer({ username, email, password }) {
    if (!username) return Promise.reject("username field must be provided");
    if (!email) return Promise.reject("email field must be provided");
    if (!password) return Promise.reject("password field must be provided");

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

    const passwordHash = await bcrypt.hash(password, saltRounds);
    let insertResponse = await pool.query(
      'INSERT INTO player ("username", "email", "password") VALUES($1, $2, $3) RETURNING *',
      [username, email, passwordHash]
    );
    responseObject.data = insertResponse.rows[0];
    return responseObject;
  }

  /**
   *
   * Only needs one of username, or email.
   * @param {string} Password - REQUIRED. Unhashed password to compare against the hashed password in the database
   * @param {username} username - username to find the user in the database
   * @param {email} email - email to find the user in the database
   *
   */
  static async comparePassword({ username, email, password }) {
    if (!password) return Promise.reject("Password is a required field");
    if (!username && !email)
      return Promise.reject("One of username or email is required");
    let playerData;
    if (username) {
      playerData = await pool.query("SELECT * FROM player WHERE username=$1", [
        username,
      ]);
    } else {
      playerData = await pool.query("SELECT * FROM player WHERE email=$1", [
        email,
      ]);
    }
    playerData = playerData.rows[0];
    if (!playerData) return { data: [] };
    let validPassword = await bcrypt.compare(password, playerData.password);
    if (validPassword)
      return {
        validPassword,
        data: {
          playerId: playerData.playerId,
          username: playerData.username,
          email: playerData.email,
        },
      };
    return { validPassword, data: null };
  }

  /**
   *
   * @param {string} partialString - The input so far, that we want to get auto-complete suggestions for
   * @returns {Array<Object>} Returns an array of objects that match the string. The objects only have a 'username' field
   */
  static async searchPlayersFromPartial(partialString) {
    if (!partialString)
      return Promise.reject("Partial string should not be empty");

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
