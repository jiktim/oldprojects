const Command = require("../../lib/Command");

class rmcommandCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Removes a custom command.",
      usage: "<command>",
      aliases: ["removecommand", "rmcmd"],
      requiredperms: "manageMessages",
      cooldown: 2000,
      staff: true,
    });
  }

  async run(msg, [name]) {
    if (!name) {
      // Gets the guildconfig
      let guildconfig = await this.bot.db.table("guildconfig").get(msg.guild.id);
      // Error handler if no arguments are given
      if (!guildconfig || !guildconfig.customCommands || !guildconfig.customCommands.length) {
        msg.channel.createMessage({
          embed: msg.errorembed("noArguments"),
        });
      } else {
        // Sends a list of custom commands
        msg.channel.createMessage(this.bot.embed("📖 Custom commands", guildconfig.customCommands.map(cmd => `\`${cmd.name}\``).join(", "), "general"));
      }
      return;
    }

    // Gets the guildconfig
    let guildconfig = await this.bot.db.table("guildconfig").get(msg.guild.id);
    // Handler for if no custom commands are created
    if (!guildconfig || !guildconfig.customCommands) return msg.channel.createMessage(this.bot.embed("❌ Error", "No custom commands are created.", "error"));
    // Finds the command
    let command = guildconfig.customCommands.find(cmd => cmd.name == name);
    // Handler for if the command already exists
    if (!command) return msg.channel.createMessage(this.bot.embed("❌ Error", `The command **${name}** doesn't exist.`, "error"));
    // Gets the custom command
    guildconfig.customCommands.splice(guildconfig.customCommands.indexOf(command), 1);
    // Removes & logs
    await this.bot.db.table("guildconfig").get(msg.guild.id).update(guildconfig);
    this.bot.emit("commandRemove", msg.channel.guild, msg.author, name);
    // Sends the embed
    msg.channel.createMessage(this.bot.embed("✅ Success", `Successfully deleted command **${name}**.`, "success"));
  }
}

module.exports = rmcommandCommand;
