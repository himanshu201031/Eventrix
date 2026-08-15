/**
 * Security regression suite for the OTP/auth flow.
 *
 * Proves two things:
 *   1. NoSQL operator injection in OTP/email fields is REJECTED — an object
 *      like `{ "$gt": "" }` must never match a stored OTP record, verify an
 *      account, mint a token, or create a booking.
 *   2. Legitimate OTPs still work end to end (register -> verify -> token).
 *
 * Uses an in-memory MongoDB (mongodb-memory-server) and supertest against the
 * real Express app exported by ../server.js — full middleware stack included.
 */

// ── Env first: before anything loads dotenv, pin test-safe values ────────
process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "silent";
process.env.JWT_SECRET = "test-only-secret";

// Mock the mail transport before the app loads, so utils/email.js picks up a
// fake transporter and no real SMTP connection is ever attempted.
const nodemailer = require("nodemailer");
nodemailer.createTransport = () => ({
  sendMail: async () => ({ messageId: "mocked", response: "250 OK (mocked)" }),
});

const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server.js");
const User = require("../models/User.js");
const Otp = require("../models/Otp.js");
const Event = require("../models/Events.js");
const Booking = require("../models/Booking.js");

const registerUser = () =>
  request(app).post("/api/v1/auth/register").send({
    username: "alice",
    email: "alice@test.dev",
    password: "Secret123!",
  });

/** Register + verify with the real stored OTP; returns the auth token. */
async function registerAndVerify() {
  await registerUser().expect(201);
  const record = await Otp.findOne({ email: "alice@test.dev" });
  assert.ok(record, "an OTP record must exist after registration");
  const res = await request(app)
    .post("/api/v1/auth/verify-otp")
    .send({ email: "alice@test.dev", otp: record.otp })
    .expect(200);
  return res.body.user.token;
}

let mongod;

before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Otp.deleteMany({}),
    Event.deleteMany({}),
    Booking.deleteMany({}),
  ]);
});

test("verify-otp rejects NoSQL operator injection in the otp field", async () => {
  await registerUser().expect(201);
  // The victim has a real pending OTP record.
  const victimOtp = await Otp.findOne({ email: "alice@test.dev" });
  assert.ok(victimOtp);

  // Attacker sends an object where a 6-digit string belongs.
  const res = await request(app)
    .post("/api/v1/auth/verify-otp")
    .send({ email: "alice@test.dev", otp: { $gt: "" } })
    .expect(422);

  assert.equal(res.body.code, "VALIDATION_ERROR");

  // No token minted, account not verified, victim's OTP not consumed.
  const user = await User.findOne({ email: "alice@test.dev" });
  assert.equal(user.isVerified, false);
  assert.equal(
    await Otp.countDocuments({ email: "alice@test.dev", action: "Acc_verify" }),
    1,
    "the victim's OTP record must survive the attack"
  );
});

test("verify-otp rejects operator injection in the email field too", async () => {
  await registerUser().expect(201);

  const res = await request(app)
    .post("/api/v1/auth/verify-otp")
    .send({ email: { $gt: "" }, otp: "123456" })
    .expect(422);

  assert.equal(res.body.code, "VALIDATION_ERROR");
  assert.equal(await User.countDocuments({ isVerified: true }), 0);
});

test("a legitimate OTP verifies the account and returns a token", async () => {
  await registerUser().expect(201);
  const record = await Otp.findOne({ email: "alice@test.dev" });

  const res = await request(app)
    .post("/api/v1/auth/verify-otp")
    .send({ email: "alice@test.dev", otp: record.otp })
    .expect(200);

  assert.equal(res.body.message, "Account verified successfully");
  assert.equal(res.body.user.email, "alice@test.dev");
  assert.ok(res.body.user.token, "a JWT must be issued");

  const user = await User.findOne({ email: "alice@test.dev" });
  assert.equal(user.isVerified, true);
  assert.equal(
    await Otp.countDocuments({ email: "alice@test.dev" }),
    0,
    "the OTP must be consumed after a successful verify"
  );
});

test("verify-otp rejects a wrong OTP", async () => {
  await registerUser().expect(201);

  const res = await request(app)
    .post("/api/v1/auth/verify-otp")
    .send({ email: "alice@test.dev", otp: "000000" })
    .expect(422);

  assert.equal(res.body.code, "VALIDATION_ERROR");
  const user = await User.findOne({ email: "alice@test.dev" });
  assert.equal(user.isVerified, false);
});

test("login cannot bypass the password check via operator injection in email", async () => {
  await registerAndVerify();

  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: { $gt: "" }, password: "whatever" })
    .expect(401);

  assert.equal(res.body.code, "UNAUTHORIZED");
});

test("booking cannot be created with an operator-injected OTP", async () => {
  const token = await registerAndVerify();

  // Seed an event with seats so a bypass would actually succeed in booking.
  const user = await User.findOne({ email: "alice@test.dev" });
  const event = await Event.create({
    title: "Neon Nights",
    description: "EDM festival",
    date: new Date("2026-12-31"),
    location: "Mumbai",
    category: "music",
    totalSeats: 100,
    availableSeats: 100,
    ticketPrice: 500,
    createdBy: user._id,
  });

  // Get a genuine booking OTP issued to this user.
  await request(app)
    .post("/api/v1/bookings/send-otp")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
  assert.equal(await Otp.countDocuments({ action: "event_booking" }), 1);

  // Attacker books with an object instead of the real OTP.
  const res = await request(app)
    .post("/api/v1/bookings")
    .set("Authorization", `Bearer ${token}`)
    .send({ eventId: event._id.toString(), otp: { $gt: "" } })
    .expect(422);

  assert.equal(res.body.code, "VALIDATION_ERROR");
  assert.equal(
    await Booking.countDocuments({}),
    0,
    "no booking may be created without a real OTP"
  );
});

test("a legitimate booking OTP still completes a booking", async () => {
  const token = await registerAndVerify();

  const user = await User.findOne({ email: "alice@test.dev" });
  const event = await Event.create({
    title: "Neon Nights",
    description: "EDM festival",
    date: new Date("2026-12-31"),
    location: "Mumbai",
    category: "music",
    totalSeats: 100,
    availableSeats: 100,
    ticketPrice: 500,
    createdBy: user._id,
  });

  await request(app)
    .post("/api/v1/bookings/send-otp")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  const record = await Otp.findOne({ action: "event_booking" });
  const res = await request(app)
    .post("/api/v1/bookings")
    .set("Authorization", `Bearer ${token}`)
    .send({ eventId: event._id.toString(), otp: record.otp })
    .expect(201);

  assert.equal(res.body.message, "Booking request submitted");
  assert.equal(await Booking.countDocuments({}), 1);
});
