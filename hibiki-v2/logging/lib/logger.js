/*
  Hibiki Logger

  This gets a server's logging channel
  and return info to the individual loggers.
*/

class Logging {
  // Sets the constructor
  constructor(db) {
    this.db = db;
  }

  // Gets the logging channel
  async getLoggingChannel(guild, type) {
    if (type != "guildLogging" && type != "modLogging") type = "guildLogging";
    // Reads the DB
    const l = await this.db.table("guildconfig").get(guild.id ? guild.id : guild);
    return l ? l[type] ? l[type] : l.loggingChannel : null;
  }
}

module.exports = Logging;
