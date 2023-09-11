const { Router } = require("express");
const Player = require("../Player/Player");
const PlayerTable = require("../Player/table");
const Sanitizer = require("../../Sanitizer");
const logger = require("../../Logs/logger");

const router = new Router();

router.post("/new", (req, res, next) => {
  const data = req.body;
  let dataString = Object.keys(data)
    .map((key) => `${key}: ${data[key]}`)
    .join(", ");

  logger.info(`POST request to Player/new with data (${dataString})`);

  const errors = sanitizeNewRoute(data);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(`User data error from Player/new endpoint: ${errorString}`);
    return next(new Error(errorString));
  }

  PlayerTable.insertPlayer(data)
    .then((responseObject) => {
      if (responseObject.emailTaken) {
        logger.info(`Email ${data.email} is already registered.`);
        return res.send("Email is already registered. Try signing in instead!");
      }
      if (responseObject.usernameTaken) {
        logger.info(`Username ${data.username} is already taken.`);
        return res.send("Username unavailable, please try again.");
      }

      const insertedPlayer = new Player(responseObject.data);
      logger.info(`Successful INSERT for Player ${insertedPlayer}`);
      res.json({ user: insertedPlayer });
    })
    .catch((err) => {
      logger.error(
        `Error INSERT into Player table unsuccessful using (${dataString})`
      );
      next(err);
    });
});

router.get("/search/:partialString", (req, res, next) => {
  const partialString = req.params.partialString;

  logger.info(`GET request to Player/search with data ${partialString}`);

  const errors = sanitizePartialString(partialString);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(`User data error from Player/search endpoint: ${errorString}`);
    return next(new Error(errorString));
  }

  PlayerTable.searchPlayersFromPartial(partialString)
    .then((matchingRows) => {
      let matchingString = matchingRows.map((row) => row.username).join(", ");
      logger.info(
        `Successful Player table query. Found matches [${matchingString}]`
      );
      res.json({ usernames: matchingRows });
    })
    .catch((err) => {
      logger.error(
        `Unsuccessful query to Player table using partialString: ${partialString}`
      );
      next(err);
    });
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
