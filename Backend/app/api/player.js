const { Router } = require("express");
const PlayerTable = require("../Player/table");
const Sanitizer = require("../../Sanitizer");
const logger = require("../../Logs/logger");

const router = new Router();

// Returns {error: true, message, target} on failure
// Returns {error: false, player} on success
router.post("/signup", (req, res) => {
  const data = req.body;
  let dataString = Object.keys(data)
    .map((key) => `${key}: ${data[key]}`)
    .join(", ");

  logger.info(`POST request to Player/signup with data (${dataString})`);

  const errors = sanitizeSignupRoute(data);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(`User data error from Player/signup endpoint: ${errorString}`);
    return res.json({
      error: true,
      message: errorString,
      target: "/player/signup",
    });
  }

  PlayerTable.insertPlayer(data)
    .then((responseObject) => {
      if (responseObject.emailTaken) {
        logger.info(`Email ${data.email} is already registered.`);
        return res.json({
          error: true,
          message: `Email ${data.email} is already registered. Try signing in`,
          target: "/player/signup",
        });
      }
      if (responseObject.usernameTaken) {
        logger.info(`Username ${data.username} is already taken.`);
        return res.json({
          error: true,
          message: `Username ${data.username} is already taken. Please try again`,
          target: "/player/signup",
        });
      }

      logger.info(
        `Successful INSERT for Player (${Object.keys(responseObject.data).map(
          (key) => `${key}:${responseObject.data[key]}`
        )})`
      );
      res.json({ error: false, player: responseObject.data });
    })
    .catch((err) => {
      logger.error(
        `Error INSERT into Player table unsuccessful using (${dataString})`
      );
      return res.json({
        error: true,
        message: err.message,
        target: "/player/signup",
      });
    });
});

// Returns {error: true, message, target} on failure
// Returns {error: false, player} on success
router.post("/login", (req, res) => {
  const data = req.body;
  let dataString = Object.keys(data)
    .map((key) => `${key}: ${data[key]}`)
    .join(", ");

  logger.debug(`POST request to Player/login with data (${dataString})`);

  const errors = sanitizeLoginRoute(data);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(`User data error from Player/login endpoint: ${errorString}`);
    return res.json({
      error: true,
      message: errorString,
      target: "/player/login",
    });
  }

  PlayerTable.comparePassword(data)
    .then((responseObject) => {
      if (responseObject.data && responseObject.data.length === 0) {
        logger.info(
          `No match for ${
            data.username
              ? `username: ${data.username}`
              : `email: ${data.email}`
          }`
        );
        return res.json({
          error: true,
          message: "No matching username/email",
          target: "/player/login",
        });
      }

      if (!responseObject.validPassword) {
        logger.info(`${data.password} was incorrect`);
        return res.json({
          error: true,
          message: "Incorrect password",
          target: "/player/login",
        });
      }

      logger.info(
        `Successful login for ${data.username ? data.username : data.email}`
      );
      return res.json({
        error: false,
        player: responseObject.data,
      });
    })
    .catch((e) => {
      return res.json({
        error: true,
        message: e.message,
        target: "/player/login",
      });
    });
});

// Returns {error: true, message, target} on failure
// Returns {error: false, [players]} on success
router.get("/search/:partialString", (req, res) => {
  const partialString = req.params.partialString;

  logger.info(`GET request to Player/search with data ${partialString}`);

  const errors = sanitizePartialString(partialString);
  if (errors) {
    let errorString = errors.join("\t");
    logger.error(`User data error from Player/search endpoint: ${errorString}`);
    return res.json({
      error: true,
      message: errorString,
      target: "/player/search",
    });
  }

  PlayerTable.searchPlayersFromPartial(partialString)
    .then((matchingRows) => {
      let matchingString = matchingRows.map((row) => row.username).join(", ");
      logger.info(
        `Successful Player table query. Found matches [${matchingString}]`
      );
      res.json({ error: false, players: matchingRows });
    })
    .catch((err) => {
      logger.error(
        `Unsuccessful query to Player table using partialString: ${partialString}`
      );
      return res.json({
        error: true,
        message: err.message,
        target: "/player/search",
      });
    });
});

module.exports = router;

function sanitizeSignupRoute(data) {
  try {
    const usernameSanitizer = new Sanitizer(data.username).sanitize();
    if (!usernameSanitizer.isValid()) return usernameSanitizer.checkErrors();
  } catch (e) {
    return [`username not provided`];
  }
  try {
    const emailSanitizer = new Sanitizer(data.email).sanitize().validateEmail();
    if (!emailSanitizer.isValid()) return emailSanitizer.checkErrors();
  } catch (e) {
    return [`email not provided`];
  }
  try {
    const passwordSanitizer = new Sanitizer(data.password).sanitize();
    if (!passwordSanitizer.isValid()) return passwordSanitizer.checkErrors();
  } catch (e) {
    return [`password not provided`];
  }
  return;
}

function sanitizeLoginRoute({ username, email, password }) {
  try {
    const passwordSanitizer = new Sanitizer(password).sanitize();
    if (!passwordSanitizer.isValid()) return passwordSanitizer.checkErrors();
  } catch (e) {
    return [`password not provided`];
  }
  if (username) {
    try {
      const usernameSanitizer = new Sanitizer(username).sanitize();
      if (!usernameSanitizer.isValid()) return usernameSanitizer.checkErrors();
    } catch (e) {
      return [`username not provided`];
    }
  } else {
    try {
      const emailSanitizer = new Sanitizer(email).sanitize().validateEmail();
      if (!emailSanitizer.isValid()) return emailSanitizer.checkErrors();
    } catch (e) {
      return [`email not provided`];
    }
  }
  return;
}

function sanitizePartialString(partialString) {
  try {
    const partialStringSanitizer = new Sanitizer(partialString).sanitize();
    if (!partialStringSanitizer.isValid())
      return partialStringSanitizer.checkErrors();
  } catch (e) {
    return [`partialString not provided`];
  }
  return;
}
