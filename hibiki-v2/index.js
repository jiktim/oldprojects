/*
  Hibiki, a jiktim project.
  © 2020 smolespi & resolved
*/

const { token, config, rethinkDB } = require("./config");
const Client = require("./lib/Client");
let db;
if (!config.provider || config.provider == "rethink")
  db = require("rethinkdbdash")(rethinkDB);
else db = require(`./providers/${config.provider}`);

// Logs in, sets some options, & loads the config/db
const bot = new Client(token, { maxShards: config.shards, autoreconnect: true, defaultImageFormat: "png", defaultImageSize: "1024" }, config, db);
// Loads the commands and events
bot.loadCommands("commands");
bot.loadEvents("events");
// Connects to Discord
bot.connect();
// Loads the logging modules
require("./logging")(bot, db);
