const { Router } = require("express");
const Player = require("../Player/Player");

const router = new Router();

router.get("/new", (req, res) => {
  res.json({ user: new Player() });
});

module.exports = router;
