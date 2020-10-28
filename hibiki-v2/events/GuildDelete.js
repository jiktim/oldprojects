/*
  Hibiki GuildDelete Event

  This updates Hibiki's stats on top.gg when
  the bot is removed from a server.
*/

const Event = require("../lib/Event");
const format = require("../utils/Format");
const fetch = require("node-fetch");
const { topgg } = require("../config");

// Sets the GuildDelete event
class guildDelete extends Event {
  constructor(...args) {
    super(...args, {
      name: "guildDelete",
    });
  }

  async run() {
    // POSTs to topgg w/ the bot user ID & stats such as guild size
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
      // Fetches the body
      let body = await res.json().catch(() => {});
      // Sends if the body returned an error
      if (body.error) {
        console.log(`${`[${format.prettyDate(new Date(), false)}]`.blue} ${`An error occured while trying to update the top.gg stats: ${body.error}`.red}`);
      }
    }
  }
}

module.exports = guildDelete;
