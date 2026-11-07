/**
 * Local development database.
 *
 * Starts a throwaway in-memory MongoDB on 127.0.0.1:27017 so the API can run
 * without a local MongoDB install or a reachable Atlas cluster. Data lives only
 * for the lifetime of this process — run `npm run seed` after it boots.
 *
 * Usage:
 *   npm run db:memory        # terminal 1
 *   npm run seed             # terminal 2 (after the DB is listening)
 *   npm run dev              # terminal 2 (or `npm start`)
 */
const { MongoMemoryServer } = require("mongodb-memory-server");

const port = Number(process.env.DEV_DB_PORT) || 27017;

(async () => {
  const mongod = await MongoMemoryServer.create({
    instance: { port, dbName: "eventrix", ip: "127.0.0.1" },
  });

  console.log(`[dev-db] MongoDB listening at ${mongod.getUri("eventrix")}`);

  const shutdown = async (signal) => {
    console.log(`[dev-db] ${signal} received, stopping MongoDB`);
    await mongod.stop();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
})().catch((err) => {
  console.error("[dev-db] Failed to start MongoDB", err);
  process.exit(1);
});
