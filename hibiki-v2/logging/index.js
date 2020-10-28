/*
  Hibiki Logging Loader

  This loads each type of logging
  event & also loads the starboard.
*/

module.exports = (bot, db) => {
  // Loads each logger
  require("./loggers/botlog")(bot, db);
  require("./loggers/eventlog")(bot, db);
  require("./loggers/modlog")(bot, db);
  // Loads each event
  require("./events/guildupdate")(bot, db);
  require("./events/memberupdate")(bot, db);
  // Loads the starboard
  require("./lib/starboard")(bot, db);
};
