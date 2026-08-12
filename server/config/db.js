const mongoose = require("mongoose");
const { logger } = require("../utils/logger");

/**
 * Connect to MongoDB with sane timeouts, wired-up lifecycle events,
 * and a fail-fast rejection for the caller.
 */
const connectDB = async () => {
  mongoose.connection.on("connected", () => logger.info("MongoDB connected"));
  mongoose.connection.on("error", (err) =>
    logger.error("MongoDB connection error", { message: err.message })
  );
  mongoose.connection.on("disconnected", () =>
    logger.warn("MongoDB disconnected")
  );

  await mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  return mongoose.connection;
};

const closeDB = async () => {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");
};

/** Human-readable connection state for the health endpoint. */
const dbState = () =>
  ["disconnected", "connected", "connecting", "disconnecting"][
    mongoose.connection.readyState
  ] ?? "unknown";

module.exports = { connectDB, closeDB, dbState };
