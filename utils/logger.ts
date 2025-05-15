import { createLogger, format, transports } from "winston";
import Transport from "winston-transport";
import pool from "../config/db";
import { logAction } from "../utils/logAction";
const { combine, timestamp, printf } = format;

class DBTransport extends Transport {
  log(info: any, callback: () => void) {
    setImmediate(() => this.emit("logged", info));

    const {
      level,
      message,
      action = null,
      status = null,
      user_id = null,
      doc_id = null,
    } = info;

    pool
      .query(
        "INSERT INTO logs (level, action, status, user_id, doc_id, message, timestamp) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [level, action, status, user_id, doc_id, message]
      )
      .catch((err) => {
        console.error("Failed to insert log into DB:", err);
      });

    callback();
  }
}

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), logFormat),
  transports: [new transports.Console(), new DBTransport()],
});

export default logger;
