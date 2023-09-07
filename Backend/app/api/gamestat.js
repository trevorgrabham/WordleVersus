const { Router } = require("express");
const GameStat = require("../GameStat/GameStat");
const GameStatTable = require("../GameStat/table");

const router = new Router();

router.post("/new", (req, res) => {
  const data = req.body;

  GameStatTable.insertGameStat(data)
    .then((enteredGameStat) => {
      return res.json({ gameStat: enteredGameStat });
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
