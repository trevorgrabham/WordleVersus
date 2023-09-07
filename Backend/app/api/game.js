const { Router } = require("express");
const Game = require("../Game/Game");

const router = new Router();

router.get("/new", (req, res) => {
  res.json({ game: new Game({}) });
});

module.exports = router;
