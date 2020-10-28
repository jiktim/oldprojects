const Command = require("../../lib/Command");
const fetch = require("node-fetch");
const config = require("../../config");

class unmonitorCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["removemonitor", "rmmonitor", "unmonitorsteam", "umonitor"],
      description: "Stops monitoring a Steam account.",
      usage: "<account>",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Handler for if no arguments were given
    if (!args[0]) {
      let monitors = [];
      const steamdb = await this.db.table("steammonitor");
      steamdb.forEach(d => d.uid == msg.author.id ? monitors.push(d) : "");
      // Sends an error if the user isnt monitoring anyone
      if (!monitors.length) {
        msg.channel.createMessage({
          embed: msg.errorembed("noArguments"),
        });
      } else {
        // Sends a list of currently monitored accounts
        msg.channel.createMessage(this.bot.embed("🎮 Steam Monitor", `You are currently monitoring: ${monitors.length > 0 ? monitors.map(m => `\`${m.uname}\``).join(",") : "Nobody"}`, "general"));
      }
      return;
    }

    let steamid;
    let res;
    // Checks for a numerical value
    if (/^\d+$/.test(args[0])) steamid = args[0];

    // Looks for a custom URL
    if (!steamid) {
      // Fetches the API
      res = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${config.steam}&vanityurl=${encodeURIComponent(args[0])}`);
      let id = await res.json().catch(() => {});
      // Sends if user couldn't be found
      if (!id || id.response.success != 1) return msg.channel.createMessage({
        embed: msg.errorembed("userNotFound"),
      });
      steamid = id.response.steamid;
    }

    // Reads the DB
    let db = await this.bot.db().table("steammonitor");
    // Handler for if there's no table/error
    if (!db) return msg.channel.createMessage(this.bot.embed("❌ Error", "An error occured with the database.", "error"));
    // Looks for a valid user
    let user = db.find(d => d.id == steamid && d.uid == msg.author.id);
    // Invalid user, looks for it in the DB
    if (!user) user = db.find(d => d.uname.toLowerCase() == args[0].toLowerCase() && d.uid == msg.author.id);
    if (user) {
      // Deletes data from the DB
      await this.bot.db.table("steammonitor").get(user.id).delete();
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("🎮 Steam Monitor", `Removed **${user.uname}** from the monitoring list.`, "general"));
    } else {
      // Sends the embed if an error happened
      msg.channel.createMessage(this.bot.embed("❌ Error", "That account isn't being monitored by you.", "error"));
    }
  }
}

module.exports = unmonitorCommand;
