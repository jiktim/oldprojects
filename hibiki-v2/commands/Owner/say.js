const Command = require("../../lib/Command");

class sayCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Makes the bot say something.",
      usage: "<text>",
      allowdisable: false,
      owner: true,
    });
  }

  async run(msg, args) {
    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Sends the embed
    msg.channel.createMessage(args.join(" "));
    // Deletes the author's message
    await msg.delete();
  }
}

module.exports = sayCommand;
