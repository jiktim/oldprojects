const { token, prefix, rethinkDB } = require("./config");
const colors = require("colors");
const db = require("rethinkdbdash")(rethinkDB);
const Eris = require("eris");
const bot = new Eris(token);
const startup = new Date();

// Loads commands that are in the commands directory
bot.cmds = require("./lib/Loader")("./commands");
// Sets the DB
bot.db = db;
bot.on("ready", () => {
  const twofactor = require("node-2fa");
  console.log(twofactor.generateToken("jngo pufb tljn 4ngm"));
  // Logs when the bot is ready
  console.log(`Ready to serve ${`${bot.guilds.size}`.bold} guilds`.yellow);
  console.log(`It took ${((new Date() - startup) / 1000).toString().bold} seconds to load and connect to discord.`.yellow);
});

// Looks for a valid command on messageCreate
bot.on("messageCreate", (msg) => {
  // If the message doesn't start with the prefix return
  if (!msg.content.startsWith(prefix)) return;
  const [cmdName, ...args] = msg.content.slice(prefix.length).split(" ").map(s => s.trim());
  // Returns if a command is invalid/can't be found
  if (bot.cmds[cmdName.toLowerCase()] == undefined) return;
  // Runs the command
  bot.cmds[cmdName.toLowerCase()](msg, args, bot);
});

// Connects to Discord
bot.connect();
