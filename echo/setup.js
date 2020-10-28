const { rethink } = require("./cfg");

let db;

// Hides redundant rethinkdbdash errors
process.on("unhandledRejection", () => {
  console.log("RethinkDB isn't configured or running properly.");
  process.exit();
});

// Checks for rethinkDB
try { db = require("rethinkdbdash")(rethink); } catch (_) {
  // Errors & ends the script if an error happened
  console.log("Either modules aren't installed or RethinkDB isn't configured properly.");
  process.exit();
}

// Sets the required tables
const requiredTables = ["projects"];

(async () => {
  // Creates the database if it doesn't exist
  const dbList = await db.dbList();
  if (!dbList.includes(rethink.db)) {
    await db.dbCreate(rethink.db);
    // Logs when the DB is created
    console.log(`Created the ${rethink.db} database`);
  }

  // Creates the tables that don't exist
  const tables = await db.tableList();
  await Promise.all(requiredTables.map(async t => {
    if (!tables.includes(t)) {
      await db.tableCreate(t);
      // Logs when each table is created
      console.log(`Created the ${t} table`);
    }
  }));

  // Logs when completed
  console.log("RethinkDB is configured properly.");
  process.exit(0);
})();
