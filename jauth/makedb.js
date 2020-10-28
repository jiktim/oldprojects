const colors = require("colors");
const { rethinkDB } = require("./config");

// Sets the DB
let db;
// Checks for rethinkdb
try { db = require("rethinkdbdash")(rethinkDB); } catch (_) {
  // Errors and ends the script if an error occured
  console.error("Error - do you have the proper deps installed?");
  process.exitCode = 1;
}

// Sets the required tables
const requiredTables = ["users"];
(async () => {
  // Sets the DB list
  const dbList = await db.dbList();
  // Creates the DB itself it it didn't exist
  if (!dbList.includes(rethinkDB.db)) {
    await db.dbCreate(rethinkDB.db);
    console.log(`${`Created the database ${rethinkDB.db}`.green}`);
  } else {
    // Logs if the DB already exists
    console.log(`${`The database ${rethinkDB.db} already exists`.yellow}`);
  }

  // Grabs the table list
  const tables = await db.tableList();
  await Promise.all(requiredTables.map(async t => {
    // Creates the tables
    if (!tables.includes(t)) {
      await db.tableCreate(t);
      console.log(`${`Created the table ${t}`.green}`);
    } else {
      // Logs if the table already exists
      console.log(`${`The table ${t} already exists`.yellow}`);
    }
  }));

  // Ends the script
  process.exit(0);
})();
