const Command = require("../../lib/Command");

class iconCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["guildicon", "servericon"],
      description: "Displays a server's icon.",
      cooldown: 2000,
    });
  }

  async run(msg, args) {
    // Gets the guild
    let guild = msg.channel.guild;
    // Lets owners return the icon of another guild
    if (args[0] && this.bot.config.owners.includes(msg.author.id)) guild = await this.bot.guilds.find(g => g.name.toLowerCase().startsWith(args.join(" ")) || g.id == args.join(" "));
    // Otherwise just use the channel guild
    else guild = msg.channel.guild;
    // Handler for if the bot isn't in the guild
    if (!guild) return msg.channel.createMessage(this.bot.embed("❌ Error", "Either the guild wasn't found or I'm not in it.", "error"));

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: `🖼 ${guild.name}'s icon`,
        image: {
          url: guild.iconURL || "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
        },
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = iconCommand;
