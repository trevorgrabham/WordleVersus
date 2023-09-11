const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "Logs/error.log",
      level: "error",
    }),
    new transports.File({ filename: "Logs/combined.log" }),
  ],
});

module.exports = logger;
