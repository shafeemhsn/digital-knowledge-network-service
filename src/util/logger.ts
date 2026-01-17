import winston from "winston";

const { combine, timestamp, printf, colorize, errors, splat } = winston.format;

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

const serializeMeta = (meta: Record<string, unknown>) => {
  try {
    return JSON.stringify(meta);
  } catch (error) {
    return `[unserializable log metadata: ${String(error)}]`;
  }
};

const logFormat = printf((info) => {
  const { level, message, timestamp, stack, ...meta } = info;
  const metaKeys = Object.keys(meta);
  const metaSuffix = metaKeys.length > 0 ? ` ${serializeMeta(meta)}` : "";
  const stackSuffix = stack ? `\n${stack}` : "";
  return `[${timestamp}] ${level}: ${message}${stackSuffix}${metaSuffix}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    colorize(),
    errors({ stack: true }),
    splat(),
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
