const { rethinkDB } = require("./config.json");
let db;
try {
	db = require("rethinkdbdash")(rethinkDB);
} catch (_) {
	console.error("Error! The DB either does not exist or you do not have the prerequisites installed.");
	process.exitCode = 1;
	return;
}
// Creates the required tables in the DB.
const requiredTables = ["merits", "strikes", "assign", "marry", "blacklist", "guildconfig", "cookies", "muteCache"];
(async() => {
	const dbList = await db.dbList();
	if (!dbList.includes(db._db)) await db.dbCreate(db._db);
	const tables = await db.tableList();
	await Promise.all(requiredTables.map(async t => {
		if (!tables.includes(t)) {
			await db.tableCreate(t);
			console.log(`Created the table ${t}`);
		} else {
			console.log(`The table ${t} is already created.`);
		}
	}));
	// Creates the marriage index.
	const indexesForMarry = await db.table("marry").indexList();
	if (!indexesForMarry.includes("marriages")) {
		await db.table("marry").indexCreate("marriageIndex", [db.row("marriedTo"), db.row("id")], { multi: true });
		console.log("Created the marriage index!");
	} else {
		console.log("Marriage index is already created!");
	}
	console.log("All done! You can run the bot now.");
	process.exit(0);
})();
