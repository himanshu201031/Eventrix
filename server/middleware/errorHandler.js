const { AppError } = require("../utils/errors");
const { logger } = require("../utils/logger");

/**
 * Standard error envelope. Every error response is:
 *   { code, message, timestamp, path, ...(errors) }
 * `message` stays at the top level so existing clients keep working;
 * `code` is the machine-readable discriminator for new ones.
 */
const errorBody = (req, { code, message, errors }) => ({
  code,
  message,
  timestamp: new Date().toISOString(),
  path: req.originalUrl,
  ...(errors ? { errors } : {}),
});

/** 404 for unknown routes — registered after all API routes. */
const notFound = (req, res) => {
  res.status(404).json(
    errorBody(req, {
      code: "NOT_FOUND",
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    })
  );
};

/**
 * Central error handler. Every error flows here (Express 5 forwards
 * rejected promises automatically).
 */
const errorHandler = (err, req, res, next) => {
  // Our own error classes first — note: AppError.ValidationError shares a
  // name with Mongoose's, so the instanceof check must come before any
  // name-based checks.
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      errorBody(req, { code: err.code || err.name, message: err.message, errors: err.errors })
    );
  }

  // Malformed JSON body (body-parser) → 400, not 500
  if (err.type === "entity.parse.failed") {
    return res.status(400).json(
      errorBody(req, { code: "INVALID_JSON", message: "Malformed JSON in request body" })
    );
  }

  // Malformed ObjectId in a URL param → 400
  if (err.name === "CastError") {
    return res.status(400).json(
      errorBody(req, { code: "INVALID_ID", message: "Invalid ID format" })
    );
  }

  // Mongoose schema validation → 422 with field messages
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(422).json(
      errorBody(req, {
        code: "VALIDATION_ERROR",
        message: errors[0] || "Validation failed",
        errors,
      })
    );
  }

  // Duplicate key (unique index) → 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json(
      errorBody(req, { code: "DUPLICATE_KEY", message: `${field} already exists` })
    );
  }

  // Unknown errors: log full details, never leak internals to clients
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  res.status(500).json(errorBody(req, { code: "INTERNAL_ERROR", message }));
};

module.exports = { notFound, errorHandler };
