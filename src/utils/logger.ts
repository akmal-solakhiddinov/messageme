import winston from "winston";

const isDev = process.env.NODE_ENV !== "production";
const level = process.env.LOG_LEVEL || (isDev ? "debug" : "info");

/* ---------------------------------- */
/* Pretty console format (DEV only)   */
/* ---------------------------------- */

const prettyFormat = winston.format.printf(
  ({ timestamp, level, message, label, stack, ...meta }) => {
    const line = "─".repeat(70);

    let out = `\n${line}\n`;
    out += `${timestamp}  ${level.toUpperCase()}`;

    if (label) out += `  [${label}]`;
    out += `\n→ ${message}\n`;

    if (Object.keys(meta).length) {
      out += `\nMETA:\n${JSON.stringify(meta, null, 2)}\n`;
    }

    if (stack) {
      out += `\nSTACK:\n${stack}\n`;
    }

    out += `${line}\n`;
    return out;
  },
);

const devConsole = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  prettyFormat,
);

/* ---------------------------------- */
/* JSON format (Docker / Prod)        */
/* ---------------------------------- */

const prodConsole = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

/* ---------------------------------- */
/* Logger instance                    */
/* ---------------------------------- */

const logger = winston.createLogger({
  level,
  exitOnError: false,
  format: isDev ? devConsole : prodConsole,
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;
