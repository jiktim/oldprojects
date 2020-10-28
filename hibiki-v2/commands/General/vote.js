const Command = require("../../lib/Command");

class voteCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Gives a link to vote on top.gg.",
      allowdms: true,
    });
  }

  run(msg) {
    msg.channel.createMessage(this.bot.embed("🗳 Vote", `Vote on top.gg [here](https://top.gg/bot/${this.bot.user.id}/vote). Each vote gives you **150** cookies.`, "general"));
  }
}

module.exports = voteCommand;
