/*
  Hibiki Command Constructor

  This is the constructor used in
  all of Hibiki's various commands.
*/

class Command {
  constructor(bot, db, name, category, params) {
    // Throw an error if a command is missing params
    if (!params) throw new Error("Error loading command");
    // Bot-related things
    this.bot = bot;
    this.db = db;
    // Command-related things
    this.aliases = params.aliases ? params.aliases : [];
    this.allowdisable = params.allowdisable == undefined ? true : params.allowdisable;
    this.allowdms = params.allowdms ? params.allowdms : false;
    this.category = params.category || category;
    this.clientperms = params.clientperms;
    this.cooldown = params.cooldown ? params.cooldown : 0;
    this.description = params.description;
    this.id = params.name ? params.name : name;
    this.nsfw = params.nsfw ? params.nsfw : false;
    this.owner = params.owner ? params.owner : false;
    this.requiredperms = params.requiredperms;
    this.staff = params.staff ? params.staff : false;
    this.usage = params.usage;
  }
}

module.exports = Command;
