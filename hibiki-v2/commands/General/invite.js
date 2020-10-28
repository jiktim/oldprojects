const Command = require("../../lib/Command");

class inviteCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Gives an invite link for the bot.",
      allowdms: true,
    });
  }

  run(msg) {
    // Sends the embed
    msg.channel.createMessage(this.bot.embed("📌 Invite", `I can be invited using [this link](https://discordapp.com/oauth2/authorize?&client_id=${this.bot.user.id}&scope=bot&permissions=${this.bot.config.permissions}).`, "general"));
  }
}

module.exports = inviteCommand;
