const pool = require("../../databasePool");

class PlayerTable {
  static insertPlayer({ username, email }) {
    return new Promise((resolve, reject) => {
      if (username === undefined)
        return reject(new Error("username field must be provided"));
      if (email === undefined)
        return reject(new Error("email field must be provided"));

      this.checkUsernameAndEmailAvailable({ username, email })
        .then(({ emailTaken, usernameTaken }) => {
          let responseObject = {
            emailTaken: emailTaken,
            usernameTaken: usernameTaken,
            data: null,
          };

          if (emailTaken || usernameTaken) return resolve(responseObject);

          this.addPlayer({ username, email }).then((data) => {
            responseObject.data = data;
            return resolve(responseObject);
          });
        })
        .catch((err) => reject(err));
    });
  }

  static checkUsernameAndEmailAvailable({ username, email }) {
    return new Promise((resolve, reject) => {
      if (username === undefined)
        reject(new Error("username field must be provided"));
      if (email === undefined)
        reject(new Error("email field must be provided"));

      pool.query(
        "SELECT username, email FROM player WHERE username=$1 OR email=$2",
        [username, email],
        (err, res) => {
          if (err) return reject(err);
          resolve(this.formatDataCheckResults(res));
        }
      );
    });
  }

  static searchPlayersFromPartial(partialString) {
    return new Promise((resolve, reject) => {
      if (partialString === "" || partialString === undefined)
        return reject(new Error("Partial string should not be empty"));

      pool.query(
        "SELECT username FROM player WHERE username LIKE $1",
        [partialString + "%"],
        (err, res) => {
          if (err) return reject(err);
          resolve(res.rows);
        }
      );
    });
  }

  static addPlayer({ username, email }) {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO player ("username", "email") VALUES($1, $2) RETURNING *',
        [username, email],
        (err, res) => {
          if (err) return reject(err);
          resolve(res.rows[0]);
        }
      );
    });
  }

  static formatDataCheckResults(res) {
    if (res.rowCount === 0)
      return {
        emailTaken: false,
        usernameTaken: false,
      };

    if (res.rowCount > 1)
      return {
        emailTaken: true,
        usernameTaken: true,
      };

    if (res.rows[0].email === email)
      return {
        emailTaken: true,
        usernameTaken: false,
      };

    if (res.rows[0].username === username)
      return {
        emailTaken: false,
        usernameTaken: true,
      };
  }
}

module.exports = PlayerTable;
