const Command = require("../../lib/Command");

class logsCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["botlogs"],
      description: "Displays the most recent logs.",
      usage: "<cmd> <logindex>",
      allowdms: true,
      owner: true,
    });
  }

  run(msg, args) {
    // Handler for if there's no logs
    if (!this.bot.logs) return msg.channel.createMessage(this.bot.embed("❌ Error", "No logs currently present.", "error"));

    // Clears the logs
    if (args[0] != undefined && args[0].toLowerCase() == "clear") {
      this.bot.logs = [];
      msg.channel.createMessage(this.bot.embed("📜 Logs", "Logs successfully cleared.", "success"));
      return;
    }

    // Assume that a command was being searched for if any args were given
    if (args.length) {
      // Looks for the command
      let cmd = this.bot.commands.find(c => c.id == args.join(" ").toLowerCase() || c.aliases.includes(args.join(" ").toLowerCase()));
      // Handler for if the command couldn't be found
      if (!cmd) return msg.channel.createMessage(this.bot.embed("❌ Error", "Command not found.", "error"));
      // Filters thru the logs
      let cmdlogs = [];
      cmdlogs = this.bot.logs.filter(l => l.msg.startsWith(`**${cmd.id}**`));
      msg.channel.createMessage(this.bot.embed("📜 Logs", `**${cmd.id}** has been ran **${cmdlogs.length}** times in the past 24 hours.`, "general"));
      return;
    }

    // Sends the embed
    msg.channel.createMessage(this.bot.embed("📜 Logs", this.bot.logs.slice(this.bot.logs.length - 20, this.bot.logs.length).map(l => `${msg.timestamp / 1000 - l.date / 1000 > 60 ? `**${(msg.timestamp / 60000 - l.date / 60000).toFixed(1)}** mins ago` : `**${(msg.timestamp / 1000 - l.date / 1000).toFixed(1)}** secs ago`} ${l.msg}`).join("\n"), "general", this.bot, `${this.bot.logs.filter(log => msg.timestamp - log.date <= 3600000 * 24).length} cmds ran in the past 24 hours`));
  }
}

module.exports = logsCommand;
