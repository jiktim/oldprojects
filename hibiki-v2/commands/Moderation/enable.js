const Command = require("../../lib/Command");

class enableCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["enablecmd", "enablecommand", "enabled"],
      description: "Enables a command.",
      usage: "<command>",
      requiredperms: "manageGuild",
      allowdisable: false,
      staff: true,
    });
  }

  async run(msg, [command]) {
    // Reads guildconfig
    let guildconfig = await this.bot.db.table("guildconfig").get(msg.guild.id);

    // Handler for if no arguments were given
    if (!command) {
      msg.channel.createMessage(this.bot.embed("🚫 Disabled Commands", guildconfig != undefined && guildconfig.disabledCmds != undefined && guildconfig.disabledCmds.length > 0 ? guildconfig.disabledCmds.join(", ") : "No commands are disabled.", "general"));
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

    // Looks for the command
    let cmd = cmds.find(c => (c.id === command || c.aliases.includes(command)) && c.allowdisable == true);
    // Looks for the category
    let category = categories.find(c => c.toLowerCase() == command.toLowerCase());
    // If it's a cmd/category
    if (!cmd && category) {
      // Inserts blank info
      if (!guildconfig.disabledCategories) guildconfig.disabledCategories = [];
      // Already disabled
      if (!guildconfig.disabledCategories.includes(category)) return msg.channel.createMessage(this.bot.embed("❌ Error", "That command/category is already disabled.", "error"));
      guildconfig.disabledCategories.splice(guildconfig.disabledCategories.indexOf(category), 1);
      // Logs to the logchannel
      this.bot.emit("commandEnable", msg.guild, category, msg.member);
      // Updates the DB
      await this.db.table("guildconfig").get(msg.guild.id).update(guildconfig);
      // Sends the embed
      return msg.channel.createMessage(this.bot.embed("✅ Success", `The ${category} category has been enabled.`, "success"));
    }

    // Handler for if an invalid command was provided
    if (cmd == undefined) return msg.channel.createMessage(this.bot.embed("❌ Error", "That command doesn't exist.", "error"));
    if (!guildconfig.disabledCmds) guildconfig.disabledCmds = [];

    // If the command is already disabled, error out, else continue
    if (guildconfig.disabledCmds != undefined && !guildconfig.disabledCmds.includes(cmd.id)) {
      msg.channel.createMessage(this.bot.embed("❌ Error", `That command isn't disabled.`, "error"));
      return;
    }

    // If the command is found, disable it and add it to the DB
    if (cmd) {
      guildconfig.disabledCmds.splice(guildconfig.disabledCmds.indexOf(cmd.id), 1);
      // Logs to the logchannel
      this.bot.emit("commandEnable", msg.guild, cmd.id, msg.member);
      // Updates the DB
      await this.db.table("guildconfig").get(msg.guild.id).update(guildconfig);
      // Sends the embed
      msg.channel.createMessage(this.bot.embed("✅ Success", `That command is now enabled.`, "success"));
    } else {
      // Handler for if the command can't be disabled/enabled
      msg.channel.createMessage(this.bot.embed("❌ Error", `Either that command is not allowed to be disabled or it couldn't be found.`, "error"));
    }
  }
}

module.exports = enableCommand;
