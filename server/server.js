const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/auth.js");
const eventRoutes = require("./routes/events.js");
const bookingRoutes = require("./routes/booking.js");
const openapiSpec = require("./openapi");
const { connectDB, closeDB, dbState } = require("./config/db");
const { logger, requestLogger } = require("./utils/logger");
const { notFound, errorHandler } = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// ── Security & performance ──────────────────────────────────────────────
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));

// CORS: permissive in development, allowlist in production
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim())
  : true;
app.use(cors({ origin: corsOrigins }));

// Structured request logging
app.use(requestLogger);

// ── Rate limiting ───────────────────────────────────────────────────────
// Stricter limit for credential endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { code: "RATE_LIMITED", message: "Too many attempts, please try again later" },
});

// General API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { code: "RATE_LIMITED", message: "Too many requests, please try again later" },
});

// ── Routes (versioned from day one) ─────────────────────────────────────
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1", apiLimiter);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// API documentation (OpenAPI 3.0)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get("/api-docs.json", (req, res) => res.json(openapiSpec));

// Health check — returns 200 only when the DB is reachable
app.get("/api/health", (req, res) => {
  const db = dbState();
  const healthy = db === "connected";
  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    version: openapiSpec.info.version,
    db,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── Error handling ──────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Boot & graceful shutdown ────────────────────────────────────────────
// The app is exported so tests (supertest) can exercise the full middleware
// stack without opening a port or connecting to a real database.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

  connectDB()
    .then(() => logger.info("MongoDB connected"))
    .catch((err) => {
      logger.error("Failed to connect to MongoDB, shutting down", {
        message: err.message,
      });
      server.close(() => process.exit(1));
    });

  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await closeDB();
      process.exit(0);
    });
    // Force exit if connections do not drain within 10s
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

module.exports = app;
