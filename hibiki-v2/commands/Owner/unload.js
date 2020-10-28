const Command = require("../../lib/Command");

class unloadCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["ul"],
      description: "Unloads a command.",
      usage: "<command>",
      allowdisable: false,
      allowdms: true,
      owner: true,
    });
  }

  run(msg, args) {
    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Looks for the command
    let cmd = this.bot.commands.find(c => c.id == args.join(" ").toLowerCase() || c.aliases.includes(args.join(" ").toLowerCase()));
    // Handler for if the command isn't found
    if (!cmd) return msg.channel.createMessage(this.bot.embed("❌ Error", "Command not found", "error"));
    // Unloads the command
    this.bot.commands.delete(cmd.id);
    // Sends the embed
    msg.channel.createMessage(this.bot.embed("✅ Success", `Unloaded ${cmd.id} successfully.`, "success"));
  }
}

module.exports = unloadCommand;
