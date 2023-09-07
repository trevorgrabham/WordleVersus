const { Router } = require("express");
const Player = require("../Player/Player");
const PlayerTable = require("../Player/table");

const router = new Router();

router.post("/new", (req, res) => {
  const data = req.body;

  PlayerTable.insertPlayer(data)
    .then((responseObject) => {
      if (responseObject.emailTaken)
        return res.send("Email is already registered. Try signing in instead!");
      if (responseObject.usernameTaken)
        return res.send("Username unavailable, please try again.");

      res.json({ user: new Player(responseObject.data) });
    })
    .catch((err) => console.error(err));
});

router.get("/search/:partialString", (req, res) => {
  const partialString = req.params.partialString;

  PlayerTable.searchPlayersFromPartial(partialString)
    .then((data) => {
      res.json({ usernames: data });
    })
    .catch((err) => console.error(err));
});

module.exports = router;
