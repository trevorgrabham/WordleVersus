const { Router } = require("express");
const User = require("../Objects/User");

const router = new Router();

router.get("/new", (req, res) => {
  res.json({ user: new User() });
});

module.exports = router;
