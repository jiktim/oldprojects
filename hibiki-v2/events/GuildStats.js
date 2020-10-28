/*
  Hibiki guildStats Event

*/

const Event = require("../lib/Event");

class guildStats extends Event {
  constructor(...args) {
    super(...args, {
      name: "guildMemberAdd"
    });
  }

  async run(guild) {
    // Reads the DB
    let cfg = await this.bot.db.table("guildconfig").get(guild.id);
    // Returns if there's no DB or if guildstats isn't enabled
    if (!cfg || !cfg.guildstats) return;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let db = await this.bot.db.table("guildstats").get(guild.id);
    const month = monthNames[new Date().getMonth()];
    const year = new Date().getUTCFullYear();

    if (!db) {
      db = { id: guild.id, };
      db[year] = {};
      db[year][`${month} ${new Date().getDate()}`] = guild.memberCount;
      await this.bot.db.table("guildstats").insert(db);
      return;
    }

    if (!db[year]) db[year] = {};
    db[year][`${month} ${new Date().getDate()}`] = guild.memberCount;
  }
}

module.exports = guildStats;
