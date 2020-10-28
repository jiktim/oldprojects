const Command = require("../../lib/Command");

class supportCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Gives an invite to the support server.",
      allowdms: true,
    });
  }

  run(msg) {
    // Sends the embed
    msg.channel.createMessage(this.bot.embed("❓ Support", `You can join the support server using [this link](https://discord.gg/${this.bot.config.support}).`, "general"));
  }
}

module.exports = supportCommand;
