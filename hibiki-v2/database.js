/*
  Hibiki Database Creator

  This is ran once before running Hibiki.
  It initializes rethinkdb & it's tables to
  the options set in the configuration file.
*/

const format = require("./utils/Format");
const { rethinkDB } = require("./config");

// Requires colors for pretty logging
require("colors");

// Sets the DB
let db;

// Checks for rethinkDB
try { db = require("rethinkdbdash")(rethinkDB); } catch (_) {
  // Errors & ends the script if an error happened
  console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Error - either the database doesn't exist or you don't have rethink running.`}`.red);
  process.exitCode = 1;
}

// Sets the required tables
const requiredTables = ["assign", "blacklist", "cookies", "guildconfig", "guildstats", "marry", "muteCache", "points", "reminders", "steammonitor", "strikes", "userconfig"];
(async () => {
  const dbList = await db.dbList();
  // Creates the DB itself it it didn't exist
  if (!dbList.includes(rethinkDB.db)) {
    await db.dbCreate(rethinkDB.db);
    // Logs when the DB is created
    console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Created the database ${rethinkDB.db}`.green}`);
  } else {
    // Logs if the DB already exists
    console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`The database ${rethinkDB.db} already exists.`.yellow}`);
  }

  // Grabs the tables list
  const tables = await db.tableList();
  await Promise.all(requiredTables.map(async t => {
    // Creates the tables
    if (!tables.includes(t)) {
      await db.tableCreate(t);
      // Logs when each table is created
      console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Created the table ${t}`.green}`);
    } else {
      // Logs if a table already exists
      console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`The table ${t} already exists.`.yellow}`);
    }
  }));

  // Grabs the marriage index
  const indexesForMarry = await db.table("marry").indexList();
  // Creates the marriage index
  if (!indexesForMarry.includes("marriageIndex")) {
    await db.table("marry").indexCreate("marriageIndex", [db.row("marriedTo"), db.row("id")], { multi: true });
    // Logs when the marriage index is created
    console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`Created the marriage index.`.green}`);
  } else {
    // Logs if the marriage index already exists
    console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`The marriage index already exists.`.yellow}`);
  }
  // Logs when completed
  console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`All databases/indexes/tables have been created.`.green}`);
  // Ends the script
  process.exit(0);
})();
