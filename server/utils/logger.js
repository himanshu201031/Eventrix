/**
 * Structured JSON logger (dependency-free).
 * Log lines are single-line JSON so any log shipper can ingest them.
 * Level is controlled by LOG_LEVEL (silent | error | warn | info | debug).
 */

const LEVELS = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };
const configured = LEVELS[process.env.LOG_LEVEL];
const currentLevel = configured === undefined ? LEVELS.info : configured;

const write = (level, msg, meta) => {
  if (LEVELS[level] > currentLevel) return;
  const line = JSON.stringify({
    level,
    time: new Date().toISOString(),
    msg,
    ...(meta !== undefined ? { meta } : {}),
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
};

const logger = {
  error: (msg, meta) => write("error", msg, meta),
  warn: (msg, meta) => write("warn", msg, meta),
  info: (msg, meta) => write("info", msg, meta),
  debug: (msg, meta) => write("debug", msg, meta),
};

/** Log one structured line per request when the response finishes. */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info("request completed", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  });
  next();
};

module.exports = { logger, requestLogger };
