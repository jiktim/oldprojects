const Command = require("../../lib/Command");

class inspectCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["lookup", "lookupinvite", "inspectinvite", "inviteinspect", "invitelookup"],
      description: "Gives info about a server invite.",
      usage: "<invite>",
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Handler for if there's no arguments
    if (!args.length || args.join(" ").split("https://discord.gg/").length == 0 || args.join(" ").split("discordapp.com/invite/").length == 0) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Invite parser
    let urlargs = args.join(" ").split(".gg/");
    if (!urlargs || !urlargs[1]) urlargs = args.join(" ").split("discordapp.com/invite/");
    // Gets the invite info
    let invinfo = await this.bot.getInvite(args[0].startsWith("https://discord.gg") || args[0].startsWith("http://discord.gg") || args[0].startsWith("discord.gg") || args[0].startsWith("https://discordapp.com/invite/") || args[0].startsWith("http://discordapp.com/invite/") || args[0].startsWith("discordapp.com/invite/") ? urlargs[1] : args.join(" "), true).catch(() => {});
    // Sends if no invite info is found
    if (!invinfo) return msg.channel.createMessage(this.bot.embed("❌ Error", "No invite found.", "error"));

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: `🔗 Info for the invite ${invinfo.code}` || "Unknown",
        thumbnail: {
          url: invinfo.guild.icon != undefined ? `https://cdn.discordapp.com/icons/${invinfo.guild.id}/${invinfo.guild.icon}.png?size=1024` : "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png"
        },
        fields: [{
          name: "Server",
          value: `${invinfo.guild.name} (${invinfo.guild.id})`,
          inline: false,
        }, {
          name: "Channel",
          value: `#${invinfo.channel.name || "Unknown Channel"} (${invinfo.channel.id || "Unknown ID"})`,
          inline: false,
        }, {
          name: "Creator",
          value: `${invinfo.inviter != undefined ? invinfo.inviter.username : "Widget"}${invinfo.inviter ? "#" : ""}${invinfo.inviter != undefined ? invinfo.inviter.discriminator : ""} (${invinfo.inviter != undefined ? invinfo.inviter.id : invinfo.guild.id})`,
          inline: false,
        }, {
          name: "Members",
          value: `${invinfo.memberCount || "Unknown"} total members, ${invinfo.presenceCount || "Unknown"} currently online`,
          inline: false,
        }],
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = inspectCommand;
