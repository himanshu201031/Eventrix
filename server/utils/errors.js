/**
 * Custom error classes — every error thrown by controllers/middleware
 * is an AppError subclass so the global handler can respond consistently.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.code = this.constructor.code || "ERROR";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  // 422 Unprocessable Entity: the request is well-formed but semantically
  // invalid (missing fields, bad OTP, sold out). 400 is reserved for
  // malformed requests (bad JSON, malformed IDs).
  static code = "VALIDATION_ERROR";
  constructor(message, errors) {
    super(message, 422);
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  static code = "NOT_FOUND";
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  static code = "UNAUTHORIZED";
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  static code = "FORBIDDEN";
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class ConflictError extends AppError {
  static code = "CONFLICT";
  constructor(message) {
    super(message, 409);
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
};
