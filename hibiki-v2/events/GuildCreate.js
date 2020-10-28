/*
  Hibiki GuildCreate Event

  This updates Hibiki's stats on top.gg when
  the bot is added to a server.
*/

const Event = require("../lib/Event");
const format = require("../utils/Format");
const fetch = require("node-fetch");
const { topgg } = require("../config");

// Sets the GuildCreate event
class guildCreate extends Event {
  constructor(...args) {
    super(...args, {
      name: "guildCreate",
    });
  }

  async run(guild) {
    // DMs the guild owner
    let owner = this.bot.users.get(guild.ownerID);
    if (owner != undefined) {
      let ownerdm = await owner.getDMChannel();
      if (ownerdm != undefined) ownerdm.createMessage(this.bot.embed(`👋 Hey, ${owner.username}, I was added to your server!`, `I'm **${this.bot.user.username}**, the ultimate all-in-one Discord bot. \n \n To get started, run ${this.bot.config.prefix}help. To configure me, you can use the [dashboard](${this.bot.config.homepage}/login/).`, "general")).catch(() => {});
    }

    // POSTs to top.gg w/ the bot user ID & stats such as guild size
    if (topgg) {
      const res = await fetch(`https://top.gg/api/bots/${this.bot.user.id}/stats`, {
        method: "POST",
        body: JSON.stringify({ server_count: this.bot.guilds.size, shard_count: this.bot.shards.size }),
        headers: {
          "cache-control": "no-cache",
          "Content-Type": "application/json",
          "Authorization": topgg,
        },
      });
      // Gets the body
      let body = await res.json().catch(() => {});
      if (!body) {
        console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`An error occured while trying to update the top.gg stats. Body not found.`.red}`);
        return;
      }
      // Sends if the body sent an error
      if (body.error) {
        console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`An error occured while trying to update the top.gg stats: ${body.error}`.red}`);
      }
    }
  }
}

module.exports = guildCreate;
