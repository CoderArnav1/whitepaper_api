const winston = require("winston");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const Logger = () => {
  const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

  return createLogger({
    level: "info",
    format: combine(timestamp(), myFormat),
    transports: [new transports.Console()],
  });
};
module.exports = Logger;
