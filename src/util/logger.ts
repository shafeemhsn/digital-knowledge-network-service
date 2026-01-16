import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const redactSensitive = (value: string) => {
  return value
    .replace(
      /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi,
      "[redacted-email]"
    );
};

const redactFormat = winston.format((info) => {
  if (typeof info.message === "string") {
    info.message = redactSensitive(info.message);
  }
  return info;
});

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    colorize(),
    redactFormat(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
