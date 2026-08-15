/**
 * Booking authorization suite.
 *
 * Confirm is admin-only (route-level middleware); cancel requires ownership
 * or admin, restores seats only when a confirmed booking is cancelled, and
 * is idempotency-guarded. These tests pin the authorization boundary so an
 * IDOR regression (cancelling someone else's booking) fails loudly.
 */

const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { app, startDb, stopDb, resetDb, createUser, createEvent, Booking, Event } = require("./helpers");

let alice;
let bob;
let admin;
let event;

before(startDb);
after(stopDb);
beforeEach(async () => {
  await resetDb();
  alice = await createUser({ username: "alice", email: "alice@test.dev" });
  bob = await createUser({ username: "bob", email: "bob@test.dev" });
  admin = await createUser({ username: "root", email: "root@test.dev", role: "admin" });
  event = await createEvent({ title: "Neon Nights", totalSeats: 10 });
});

const makeBooking = (status = "pending") =>
  Booking.create({
    userId: alice.user._id,
    eventId: event._id,
    status,
    paymentStatus: "not_paid",
    amount: 500,
  });

test("unauthenticated confirm/cancel requests are rejected", async () => {
  const booking = await makeBooking();
  await request(app).put(`/api/v1/bookings/${booking._id}/confirm`).expect(401);
  await request(app).delete(`/api/v1/bookings/${booking._id}`).expect(401);
});

test("a regular user cannot confirm a booking — admin only", async () => {
  const booking = await makeBooking();

  const res = await request(app)
    .put(`/api/v1/bookings/${booking._id}/confirm`)
    .set("Authorization", `Bearer ${alice.token}`)
    .expect(403);

  assert.equal(res.body.code, "FORBIDDEN");
  assert.equal((await Booking.findById(booking._id)).status, "pending");
});

test("an admin confirms a booking and the seat is deducted", async () => {
  const booking = await makeBooking();

  const res = await request(app)
    .put(`/api/v1/bookings/${booking._id}/confirm`)
    .set("Authorization", `Bearer ${admin.token}`)
    .send({ paymentStatus: "paid" })
    .expect(200);

  assert.equal(res.body.booking.status, "confirmed");
  assert.equal(res.body.booking.paymentStatus, "paid");
  assert.equal((await Event.findById(event._id)).availableSeats, 9);
});

test("confirming an already-confirmed booking returns 409", async () => {
  const booking = await makeBooking();
  const confirm = () =>
    request(app)
      .put(`/api/v1/bookings/${booking._id}/confirm`)
      .set("Authorization", `Bearer ${admin.token}`);

  await confirm().expect(200);
  const res = await confirm().expect(409);
  assert.equal(res.body.code, "CONFLICT");
});

test("a user cannot cancel someone else's booking (IDOR blocked)", async () => {
  const booking = await makeBooking();

  const res = await request(app)
    .delete(`/api/v1/bookings/${booking._id}`)
    .set("Authorization", `Bearer ${bob.token}`)
    .expect(403);

  assert.equal(res.body.code, "FORBIDDEN");
  assert.equal((await Booking.findById(booking._id)).status, "pending");
});

test("an owner can cancel their own pending booking", async () => {
  const booking = await makeBooking();

  await request(app)
    .delete(`/api/v1/bookings/${booking._id}`)
    .set("Authorization", `Bearer ${alice.token}`)
    .expect(204);

  assert.equal((await Booking.findById(booking._id)).status, "cancelled");
  // A pending booking never deducted a seat, so none is restored.
  assert.equal((await Event.findById(event._id)).availableSeats, 10);
});

test("an admin can cancel anyone's booking", async () => {
  const booking = await makeBooking("confirmed");

  await request(app)
    .delete(`/api/v1/bookings/${booking._id}`)
    .set("Authorization", `Bearer ${admin.token}`)
    .expect(204);

  assert.equal((await Booking.findById(booking._id)).status, "cancelled");
});

test("cancelling a confirmed booking restores the seat", async () => {
  const booking = await makeBooking();
  await request(app)
    .put(`/api/v1/bookings/${booking._id}/confirm`)
    .set("Authorization", `Bearer ${admin.token}`)
    .expect(200);
  assert.equal((await Event.findById(event._id)).availableSeats, 9);

  await request(app)
    .delete(`/api/v1/bookings/${booking._id}`)
    .set("Authorization", `Bearer ${alice.token}`)
    .expect(204);

  assert.equal((await Event.findById(event._id)).availableSeats, 10);
});

test("cancelling an already-cancelled booking returns 409", async () => {
  const booking = await makeBooking();
  const cancel = () =>
    request(app)
      .delete(`/api/v1/bookings/${booking._id}`)
      .set("Authorization", `Bearer ${alice.token}`);

  await cancel().expect(204);
  const res = await cancel().expect(409);
  assert.equal(res.body.code, "CONFLICT");
});
