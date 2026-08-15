/**
 * Event search hardening suite.
 *
 * The catalog search used to feed the raw query string into a `$regex` —
 * an operator-injection surface and a ReDoS risk. The fix coerces to a
 * scalar, caps at 100 chars, and escapes regex metacharacters so the search
 * is always a literal substring match. These tests pin that behavior.
 */

const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { app, startDb, stopDb, resetDb, Event } = require("./helpers");

const seedTwoEvents = () =>
  Event.create([
    {
      title: "Neon Nights EDM Festival",
      description: "EDM festival",
      date: new Date("2026-12-31"),
      location: "Mumbai",
      category: "music",
      totalSeats: 100,
      availableSeats: 100,
      ticketPrice: 500,
    },
    {
      title: "Global Leaders Business Summit",
      description: "Leadership summit",
      date: new Date("2026-11-01"),
      location: "Delhi",
      category: "business",
      totalSeats: 50,
      availableSeats: 50,
      ticketPrice: 2000,
    },
  ]);

before(startDb);
after(stopDb);
beforeEach(async () => {
  await resetDb();
});

test("search matches a plain substring case-insensitively", async () => {
  await seedTwoEvents();

  const res = await request(app)
    .get("/api/v1/events")
    .query({ search: "nIgHtS" })
    .expect(200);

  assert.equal(res.body.total, 1);
  assert.equal(res.body.items[0].title, "Neon Nights EDM Festival");
});

test("regex metacharacters are treated literally, not as wildcards", async () => {
  await seedTwoEvents();

  // "." is a regex wildcard — if unescaped, "Neon." would match "Neon "
  // (the space after "Neon"). The fix must return zero results here.
  const res = await request(app)
    .get("/api/v1/events")
    .query({ search: "Neon." })
    .expect(200);

  assert.equal(res.body.total, 0);
});

test("search is truncated to 100 characters", async () => {
  await seedTwoEvents();

  // Only the first 100 chars of the query survive the cap; the "Nights"
  // fragment falls outside it and must not match anything.
  const res = await request(app)
    .get("/api/v1/events")
    .query({ search: `${"X".repeat(100)}Nights` })
    .expect(200);

  assert.equal(res.body.total, 0);
});

test("catastrophic-looking regex patterns complete without hanging", { timeout: 5000 }, async () => {
  await seedTwoEvents();

  // Classic ReDoS bombs. Escaped, they are inert literal searches; without
  // the hardening they could hang the query (hence the explicit timeout).
  for (const pattern of ["(a+)+$", "(a|aa)+$", `${"(a+)+$".repeat(30)}`]) {
    const res = await request(app)
      .get("/api/v1/events")
      .query({ search: pattern })
      .expect(200);
    assert.ok(Array.isArray(res.body.items), `pattern ${pattern.slice(0, 20)}... must not crash`);
  }
});

test("the search endpoint returns the paginated envelope", async () => {
  await seedTwoEvents();

  const res = await request(app).get("/api/v1/events").expect(200);

  assert.deepEqual(Object.keys(res.body).sort(), ["items", "page", "page_size", "pages", "total"]);
  assert.equal(res.body.total, 2);
  assert.equal(res.body.items.length, 2);
});
