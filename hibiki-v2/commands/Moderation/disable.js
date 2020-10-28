const Command = require("../../lib/Command");

class disableCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["disablecmd", "disablecommand", "disabled"],
      description: "Disables a command or lists the currently disabled commands.",
      usage: "<command> | <category>",
      requiredperms: "manageGuild",
      allowdisable: false,
      staff: true,
    });
  }

  async run(msg, [command]) {
    // Reads the DB
    let guildconfig = await this.bot.db.table("guildconfig").get(msg.guild.id);

    // Handler for if no arguments were given
    if (!command) {
      let disabledCmds = [];
      let disabledCategories = [];
      if (guildconfig != undefined && guildconfig.disabledCmds != undefined && guildconfig.disabledCmds.length) disabledCmds = guildconfig.disabledCmds;
      if (guildconfig != undefined && guildconfig.disabledCategories != undefined && guildconfig.disabledCategories.length) disabledCategories = guildconfig.disabledCategories.map(cat => `**${cat}**`);
      msg.channel.createMessage(this.bot.embed(`🚫 Disabled ${disabledCmds.length == 0 && disabledCategories.length > 0 ? "Categories" : "Commands"}`, disabledCmds.length || disabledCategories.length ? [...disabledCmds, disabledCategories].join(", ") : "No commands are disabled.", "general"));
      return;
    }

    // If no command name is given, error out, else continue
    const cmds = this.bot.commands.filter(cmd => cmd.allowdisable);
    let categories = [];
    this.bot.commands.forEach(c => categories.includes(c.category) && c.category != "Owner" ? "filler" : categories.push(c.category));

    // If no guildConfig is setup, create it
    if (!guildconfig) {
      // Inserts the config
      await this.db.table("guildconfig").insert({
        id: msg.guild.id,
        disabledCmds: [],
        disabledCategories: []
      });
      guildconfig = {
        id: msg.guild.id,
        disabledCmds: [],
        disabledCategories: []
      };
    }

    // Searches for the command
    let cmd = cmds.find(c => (c.id === command || c.aliases.includes(command)) && c.allowdisable == true);
    // Looks for the category
    let category = categories.find(c => c.toLowerCase() == command.toLowerCase());
    // If it's a command/category
    if (!cmd && category) {
      // Inserts blank info
      if (!guildconfig.disabledCategories) guildconfig.disabledCategories = [];
      // Disalllowed from disable
      if (category == "Owner" || category == "General") return msg.channel.createMessage(this.bot.embed("❌ Error", "Either that isn't allowed to be disabled or it couldn't be found.", "error"));
      if (guildconfig.disabledCategories != undefined && guildconfig.disabledCategories.includes(category)) return msg.channel.createMessage(this.bot.embed("❌ Error", "That command/category is already disabled.", "error"));
      // Pushes
      guildconfig.disabledCategories.push(category);
      // Logs to the logchannel
      this.bot.emit("commandDisable", msg.guild, category, msg.member);
      // Updates the DB
      await this.db.table("guildconfig").get(msg.guild.id).update(guildconfig);
      // Sends the embed
      return msg.channel.createMessage(this.bot.embed("✅ Success", `The ${category} category have been disabled`, "success"));
    }

    // Handler for if an invalid command was provided
    if (cmd == undefined) return msg.channel.createMessage(this.bot.embed("❌ Error", "Command not found.", "error"));
    // Blank array
    if (!guildconfig.disabledCmds) guildconfig.disabledCmds = [];

    // If the command is already disabled, error out, else continue
    if (guildconfig.disabledCmds != undefined && guildconfig.disabledCmds.includes(cmd.id)) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `That command is already disabled.`, "error"));
      return;
    }

    // If the command is found, disable it and add it to the DB
    if (cmd) {
      guildconfig.disabledCmds.push(cmd.id);
      // Logs to the logchannel
      this.bot.emit("commandDisable", msg.guild, command, msg.member);
      // Updates the DB
      await this.db.table("guildconfig").get(msg.guild.id).update(guildconfig);
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("✅ Success", `That command is now disabled.`, "success"));
    } else {
      // Handler for if the command can't be disabled/enabled
      msg.channel.createMessage(this.bot.embed("❌ Error", `Either that command is not allowed to be disabled or it couldn't be found.`, "error"));
    }
  }
}

module.exports = disableCommand;
