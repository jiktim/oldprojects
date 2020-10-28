const Command = require("../../lib/Command");
const format = require("../../utils/Format");

class serverCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["aboutserver", "aboutguild", "guild", "guildinfo", "serverinfo"],
      description: "Displays info about the current server.",
      cooldown: 3000,
    });
  }

  async run(msg, args) {
    // Lets owners return info of another guild
    let guild = msg.channel.guild;
    if (args[0] && this.bot.config.owners.includes(msg.author.id)) guild = await this.bot.guilds.find(g => g.name.toLowerCase().startsWith(args.join(" ")) || g.id == args.join(" "));
    // Otherwise just use the channel guild
    else guild = msg.channel.guild;
    // Handler for if the bot isn't in the guild
    if (!guild) return msg.channel.createMessage(this.bot.embed("❌ Error", "Either the server wasn't found or I'm not in it.", "error"));

    // Seperates bot users & normal members
    let bots = 0;
    let users = 0;
    await guild.members.forEach(mem => {
      if (mem.bot == true) {
        bots++;
      } else {
        users++;
      }
    });

    // Seperates voice channels and text channels
    let voice = 0;
    let text = 0;
    await guild.channels.forEach(chan => {
      if (chan.type === 0) text++;
      if (chan.type === 2) voice++;
    });

    // Sets the text for members/channel
    let members = `${users} members, ${bots} bots`;
    let channels = `${text} text, ${voice} voice`;

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        author: {
          icon_url: guild.iconURL || "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
          name: guild.name,
        },
        thumbnail: {
          url: guild.iconURL || "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
        },
        fields: [{
          name: "Server ID",
          value: guild.id || "Unknown",
          inline: true,
        }, {
          name: "Owner",
          value: format.tag(guild.members.find(mem => mem.id == guild.ownerID, false)) || "Unknown",
          inline: true,
        }, {
          name: "Members",
          value: members || "0",
          inline: true,
        }, {
          name: "Creation Date",
          value: format.prettyDate(guild.createdAt) || "Unknown",
          inline: true,
        }, {
          name: "Channels",
          value: channels || "0",
          inline: true,
        }, {
          name: "Roles",
          value: guild.roles.size || "0",
          inline: true,
        }, {
          name: "Emojis",
          value: guild.emojis.length || "0",
          inline: true,
        }, {
          name: "Region",
          value: format.region(guild.region) || "Unknown",
          inline: true,
        }, {
          name: "Verification Level",
          value: format.verificationlevel(guild.verificationLevel) || "Unknown",
          inline: true,
        }, {
          name: "2FA Requirement",
          value: format.mfaLevel(guild.mfaLevel) || "Unknown",
          inline: true,
        }, {
          name: "Notification Setting",
          value: format.notifsettings(guild.defaultNotifications) || "Unknown",
          inline: true,
        }, {
          name: "Content Filter",
          value: format.contentfilter(guild.explicitContentFilter) || "Unknown",
          inline: true,
        }, {
          name: "Boost Level",
          value: `${format.tierlevel(guild.premiumTier) || "0"}`,
          inline: true,
        }, {
          name: "Boosting Members",
          value: `${guild.premiumSubscriptionCount || "0"}`,
          inline: true
        }, {
          name: "Boost Features",
          value: format.featureParse(guild.features).join(", ") || "None",
          inline: true,
        }],
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = serverCommand;
