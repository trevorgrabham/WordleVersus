const { Router } = require("express");
const Player = require("../Player/Player");
const PlayerTable = require("../Player/table");
const Sanitizer = require("../../Sanitizer");

const router = new Router();

router.post("/new", (req, res) => {
  const data = req.body;

  const errors = sanitizeNewRoute(data);
  if (errors) return res.send(errors);

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

  const errors = sanitizePartialString(partialString);
  if (errors) return res.send(errors);

  PlayerTable.searchPlayersFromPartial(partialString)
    .then((data) => {
      res.json({ usernames: data });
    })
    .catch((err) => console.error(err));
});

module.exports = router;

function sanitizeNewRoute(data) {
  try {
    const usernameSanitizer = new Sanitizer(data.username).sanitize();
    if (!usernameSanitizer.isValid()) return usernameSanitizer.checkErrors();

    const emailSanitizer = new Sanitizer(data.email).sanitize().validateEmail();
    if (!emailSanitizer.isValid()) return emailSanitizer.checkErrors();
  } catch (e) {
    return e.message;
  }
  return;
}

function sanitizePartialString(partialString) {
  try {
    const partialStringSanitizer = new Sanitizer(partialString).sanitize();
    if (!partialStringSanitizer.isValid())
      return partialStringSanitizer.checkErrors();
  } catch (e) {
    return e.message;
  }
  return;
}
