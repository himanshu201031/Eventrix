/**
 * Shared harness for the server integration suites.
 *
 * Must be required BEFORE anything imports the app: it pins test-safe env
 * vars and replaces the nodemailer transport so no real SMTP connection is
 * ever attempted. Every test file runs in its own process (node --test), so
 * requiring this module per-file is isolated and safe.
 */

// ── Env first: before dotenv can load real values ────────────────────────
process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "silent";
process.env.JWT_SECRET = "test-only-secret";

// Mock the mail transport before the app loads, so utils/email.js picks up a
// fake transporter and no real SMTP connection is ever attempted.
const nodemailer = require("nodemailer");
nodemailer.createTransport = () => ({
  sendMail: async () => ({ messageId: "mocked", response: "250 OK (mocked)" }),
});

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");

const app = require("../server.js");
const User = require("../models/User.js");
const Otp = require("../models/Otp.js");
const Event = require("../models/Events.js");
const Booking = require("../models/booking.js");

let mongod;

/** Boot an in-memory MongoDB and connect Mongoose to it. */
const startDb = async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
};

/** Tear the DB down. */
const stopDb = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};

/** Empty every collection so each test starts clean. */
const resetDb = async () => {
  await Promise.all([
    User.deleteMany({}),
    Otp.deleteMany({}),
    Event.deleteMany({}),
    Booking.deleteMany({}),
  ]);
};

/** Sign a JWT exactly like the auth controller does. */
const signToken = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

/** Create a user doc and return it with a valid token. */
const createUser = async ({ username, email, role = "user", password = "Password123!" } = {}) => {
  const user = await User.create({ username, email, password, role, isVerified: true });
  return { user, token: signToken(user) };
};

/** Create an event doc; availableSeats always mirrors totalSeats. */
const createEvent = async ({ totalSeats = 100, ...overrides } = {}) =>
  Event.create({
    title: "Neon Nights EDM Festival",
    description: "EDM festival",
    date: new Date("2026-12-31"),
    location: "Mumbai",
    category: "music",
    totalSeats,
    availableSeats: totalSeats,
    ticketPrice: 500,
    ...overrides,
  });

/** Register + verify with the real stored OTP; returns the auth token. */
const registerAndVerify = async (username = "alice", email = "alice@test.dev") => {
  await request(app)
    .post("/api/v1/auth/register")
    .send({ username, email, password: "Secret123!" })
    .expect(201);
  const record = await Otp.findOne({ email });
  const res = await request(app)
    .post("/api/v1/auth/verify-otp")
    .send({ email, otp: record.otp })
    .expect(200);
  return res.body.user.token;
};

module.exports = {
  app,
  startDb,
  stopDb,
  resetDb,
  signToken,
  createUser,
  createEvent,
  registerAndVerify,
  User,
  Otp,
  Event,
  Booking,
};
