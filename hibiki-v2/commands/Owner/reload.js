const Command = require("../../lib/Command");

class reloadCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["rl"],
      description: "Reloads a command.",
      usage: "<command>",
      allowdisable: false,
      allowdms: true,
      owner: true,
    });
  }

  async run(msg, args) {
    // Handler for if no arguments are given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Looks for the command; reloads all if "all" is given
    if (args.join(" ").toLowerCase() == "*" || args.join(" ").toLowerCase() == "all") args = this.bot.commands.map(c => c.id);
    let success = [];
    let fail = [];

    // Attempts to reload each command
    args.forEach(arg => {
      let command;
      // Gets the command
      let cmd = this.bot.commands.find(c => c.id == arg.toLowerCase() || c.aliases.includes(arg.toLowerCase()));
      // Errors if the command isn't found
      if (!cmd) return fail.push({ id: arg.toLowerCase(), error: "Command not found." });
      // Sets the old module
      let oldmodule = require(`../${cmd.category}/${cmd.id}`);
      // Deletes the require cache
      delete require.cache[require.resolve(`../${cmd.category}/${cmd.id}`)];
      try {
        command = require(`../${cmd.category}/${cmd.id}`);
      } catch (err) {
        // Handler for if an error happened
        fail.push({ id: cmd.id, error: err });
        this.bot.commands.add(new oldmodule(this.bot, this.db, cmd.id, cmd.category));
      }

      if (command) {
        this.bot.commands.delete(cmd.id);
        // Tries to reload the command
        this.bot.commands.add(new command(this.bot, this.db, cmd.id, cmd.category));
        success.push(cmd.id);
      }
    });

    msg.channel.createMessage({
      embed: {
        title: `🔄 Successfully reloaded ${success.length == 1 ? success[0] : `${success.length} commands${fail.length > 0 ? ` with ${fail.length} failed command${fail.length == 1 ? "" : "s"}` : ""}`}.`,
        description: fail.length > 0 ? fail.map(failedcmd => `**${failedcmd.id}** error: \`\`\`js\n${failedcmd.error}\`\`\``).join("\n") : null,
        color: fail.length > 0 ? require("../../utils/Colour")("error") : require("../../utils/Colour")("success"),
      }
    });
  }
}

module.exports = reloadCommand;
