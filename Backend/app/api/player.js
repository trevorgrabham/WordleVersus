const { Router } = require("express");
const Player = require("../Player/Player");
const PlayerTable = require("../Player/table");
const Sanitizer = require("../../Sanitizer");
const logger = require("../../Logs/logger");

const router = new Router();

router.post("/signup", (req, res, next) => {
  const data = req.body;
  let dataString = Object.keys(data)
    .map((key) => `${key}: ${data[key]}`)
    .join(", ");

  logger.info(`POST request to Player/signup with data (${dataString})`);

  const errors = sanitizeSignupRoute(data);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(`User data error from Player/signup endpoint: ${errorString}`);
    return next(new Error(errorString));
  }

  PlayerTable.insertPlayer(data)
    .then((responseObject) => {
      if (responseObject.emailTaken) {
        logger.info(`Email ${data.email} is already registered.`);
        return res.json({
          error: true,
          errorMessage: `Email ${data.email} is already registered. Try signing in`,
        });
      }
      if (responseObject.usernameTaken) {
        logger.info(`Username ${data.username} is already taken.`);
        return res.json({
          error: true,
          errorMessge: `Username ${data.username} is already taken. Please try again`,
        });
      }

      const insertedPlayer = new Player(responseObject.data);
      logger.info(`Successful INSERT for Player ${insertedPlayer}`);
      res.json({ error: false, player: insertedPlayer });
    })
    .catch((err) => {
      logger.error(
        `Error INSERT into Player table unsuccessful using (${dataString})`
      );
      next(err);
    });
});

router.post("/login", (req, res, next) => {
  const data = req.body;
  let dataString = Object.keys(data)
    .map((key) => `${key}: ${data[key]}`)
    .join(", ");

  logger.debug(`POST request to Player/login with data (${dataString})`);

  const errors = sanitizeLoginRoute(data);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(`User data error from Player/login endpoint: ${errorString}`);
    return next(new Error(errorString));
  }

  PlayerTable.comparePassword(data)
    .then((responseObject) => {
      if (!responseObject.validPassword) {
        logger.info(`${data.password} was incorrect`);
        return res.json({
          error: true,
          errorMessage: "Incorrect password",
        });
      }

      if (responseObject.data.length === 0) {
        logger.info(
          `No match for ${
            username ? `username: ${data.username}` : `email: ${data.email}`
          }`
        );
        return res.json({
          error: true,
          errorMessage: "No matching username/email",
        });
      }

      logger.info(`Successful login for ${data.username}`);
      return res.json({
        error: false,
        player: new Player(responseObject.data),
      });
    })
    .catch((e) => {
      return next(e);
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

function sanitizeSignupRoute(data) {
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

function sanitizeLoginRoute({ username, email }) {
  try {
    if (username) {
      const usernameSanitizer = new Sanitizer(username).sanitize();
      if (!usernameSanitizer.isValid()) return usernameSanitizer.checkErrors();
    } else {
      const emailSanitizer = new Sanitizer(email).sanitize().validateEmail();
      if (!emailSanitizer.isValid()) return emailSanitizer.checkErrors();
    }
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
