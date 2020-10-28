const Command = require("../../lib/Command");

class pingCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["pig", "pingpong", "pog", "pong"],
      description: "Pings the bot.",
      allowdisable: false,
    });
  }

  async run(msg) {
    // Sets the first message
    const message = await msg.channel.createMessage(this.bot.embed("🏓 Ping", `Latency: ${msg.channel.guild.shard.latency}ms.`, "general"));
    // Edits the original message with the bot's ping
    message.edit({
      embed: {
        title: "🏓 Pong!",
        description: `This message took ${message.timestamp - msg.timestamp}ms.`,
        color: require("../../utils/Colour")("general"),
      }
    });
  }
}

module.exports = pingCommand;
