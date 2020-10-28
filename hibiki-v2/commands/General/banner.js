const Command = require("../../lib/Command");

class bannerCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Displays the server's banner.",
      cooldown: 3000,
    });
  }

  async run(msg) {
    // Return if the guild doesn't have a banner
    if (!msg.guild.banner) return msg.channel.createMessage(this.bot.embed("❌ Error", "This server doesn't have a banner.", "error"));

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: `🖼 ${msg.guild.name}'s banner`,
        image: {
          url: msg.guild.dynamicBannerURL(null, 1024) || "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
        },
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = bannerCommand;
