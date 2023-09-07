const pool = require("../../databasePool");

class GameTable {
  static insertGame({ creationDatetime, p1id, p2id, winner }) {
    if (creationDatetime === undefined) creationDatetime = new Date();

    return new Promise((resolve, reject) => {
      if (p1id === undefined) return reject(new Error("Missing field: p1id"));
      if (p2id === undefined) return reject(new Error("Missing field: p2id"));
      if (winner === undefined)
        return reject(new Error("Missing field: winner"));

      pool.query(
        'INSERT INTO game ("creationDatetime", "p1id", "p2id", winner) VALUES($1, $2, $3, $4) RETURNING *',
        [creationDatetime, p1id, p2id, winner],
        (err, res) => {
          if (err) return reject(err);
          console.log("Successfully insert into game table");
          console.log(res.rows[0]);
          resolve(res.rows[0]);
        }
      );
    });
  }

  static selectGame({ id, player }) {
    return new Promise((resolve, reject) => {
      if (id === undefined && player === undefined)
        return reject(new Error("Must define one of id or player"));

      if (id && player)
        return reject(
          new Error("This function was not meant to take multiple paramerters")
        );

      if (id) {
        pool.query("SELECT * FROM game WHERE id=$1", [id], (err, res) => {
          if (err) return reject(err);
          resolve(res.rows[0]);
        });
      }

      if (player) {
        pool.query(
          'SELECT * FROM game WHERE "p1id"=$1 OR "p2id"=$1',
          [player],
          (err, res) => {
            if (err) return reject(err);
            resolve(res.rows);
          }
        );
      }
    });
  }
}

module.exports = GameTable;
