const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const Event = require("./models/Events.js");
const { getEvents } = require("./controllers/eventController.js");

(async () => {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri(), { serverSelectionTimeoutMS: 20000 });
  const base = { description: "d", location: "Goa", category: "Music", totalSeats: 100, availableSeats: 90, ticketPrice: 500, image: "", createdBy: null };
  for (let i = 0; i < 7; i += 1) {
    await Event.create({ ...base, title: `Event ${i}`, date: new Date(Date.UTC(2026, 0, i + 1)) });
  }

  const req = (q) => ({ query: q });
  const res = () => {
    const r = { _json: null, headers: {}, statusCode: 200 };
    r.set = (k, v) => { r.headers[k] = v; return r; };
    r.json = (b) => { r._json = b; };
    return r;
  };

  const r1 = res();
  await getEvents(req({}), r1);
  console.log("default:", JSON.stringify({ keys: Object.keys(r1._json), page: r1._json.page, page_size: r1._json.page_size, total: r1._json.total, pages: r1._json.pages }), "| cache:", r1.headers["Cache-Control"]);

  const r2 = res();
  await getEvents(req({ page: "2", page_size: "3", sort: "-date" }), r2);
  console.log("page2 size3 sort=-date:", JSON.stringify({ page: r2._json.page, page_size: r2._json.page_size, count: r2._json.items.length, total: r2._json.total, pages: r2._json.pages, titles: r2._json.items.map((e) => e.title) }));

  const r3 = res();
  await getEvents(req({ sort: "DROP_TABLE", page_size: "500" }), r3);
  console.log("sort whitelist + page_size clamp:", JSON.stringify({ count: r3._json.items.length, page_size: r3._json.page_size }));

  await mongoose.disconnect();
  await mongod.stop();
  process.exit(0);
})().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
