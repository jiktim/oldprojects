const Command = require("../../lib/Command");
const fetch = require("node-fetch");
const config = require("../../config");

class steammonitorCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["steammonitor", "monitorsteam"],
      description: "Monitors a Steam account for future bans.",
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
    // Checks if its a numerical value or a string to deterime whether to do URL
    if (/^\d+$/.test(args[0])) steamid = args[0];

    // Looks for vanity url
    if (!steamid) {
      // Fetches the API
      res = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${config.steam}&vanityurl=${encodeURIComponent(args[0])}`);
      let id = await res.json().catch(() => {});
      // Sends if the user couldn't be found
      if (!id || id.response.success != 1) return msg.channel.createMessage({
        embed: msg.errorembed("userNotFound"),
      });
      steamid = id.response.steamid;
    }

    // Fetches the API
    res = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.steam}&steamids=${steamid}`);
    let profile = await res.json().catch(() => {});
    profile = profile.response.players[0];

    // Handler for if user isn't found
    if (!profile || profile.personaname == "undefined") return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // Constructor
    let construct = {
      id: steamid,
      uid: msg.author.id,
      pfp: profile.avatarfull,
      uname: profile.personaname,
      date: new Date()
    };

    // Inserts the construct into the DB
    let db = await this.bot.db().table("steammonitor");
    let acccount = 0;

    // looks for id
    db.forEach(d => {
      if (d.uid == msg.author.id) acccount++;
    });

    // Only 3 accounts can be monitored at a time
    if (acccount >= 3) return msg.channel.createMessage(this.bot.embed("❌ Error", "You can only monitor 3 accounts at a time.", "error"));
    // If something's wrong with the db (uhoh)
    if (!db) return msg.channel.createMessage(this.bot.embed("❌ Error", "An error occured with the database.", "error"));

    if (!db.find(d => d.id == steamid)) {
      // Fetches the API
      res = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${config.steam}&steamids=${steamid}`);
      let ban = await res.json().catch(() => {});
      ban = ban.players[0];
      // Handler for if they've already been banned
      if (ban.VACBanned || ban.NumberOfGameBans > 0) return msg.channel.createMessage(this.bot.embed("❌ Error", `**${profile.personaname}** has already been **${ban.VACBanned ? "VAC" : "game"} banned**.`, "error"));
      // Inserts the construct into the DB
      await this.bot.db.table("steammonitor").insert(construct);
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("🎮 Steam Monitor", `Monitoring **${profile.personaname}** for the next 3 days (checking every 30 minutes).`, "general"));
    } else {
      // Sends embed if already monitored
      msg.channel.createMessage(this.bot.embed("❌ Error", `**${profile.personaname}** is already being monitored.`, "error"));
    }
  }
}

module.exports = steammonitorCommand;
