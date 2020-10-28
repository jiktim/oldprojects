const Command = require("../../lib/Command");
const format = require("../../utils/Format");

class channelinfoCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["aboutchannel", "channel", "cinfo"],
      description: "Returns information about a channel.",
      usage: "<channel>",
    });
  }

  run(msg, args) {
    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Finds the channel
    let channel = msg.channel.guild.channels.find(c => {
      if (c.id == args.join(" ")) return c;
      if (args.join(" ") == `<#${c.id}>`) return c;
      if (c.name.toLowerCase().startsWith(args.join(" ").toLowerCase())) return c;
    });

    // Handler for if the channel is invalid or can't be found
    if (!channel) return msg.channel.createMessage(this.bot.embed("❌ Error", "Either an invalid channel was given or it couldn't be found.", "error"));

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: `📗 Info for ${channel.name}`,
        fields: [{
          name: "About",
          value: `#${channel.name} (${channel.id}) (${channel.type == 0 ? "text" : "voice"} channel)`,
          inline: false,
        }, {
          name: "Category",
          value: `${channel.parentID != undefined ? msg.channel.guild.channels.get(channel.parentID).name : "No category"}`,
          inline: false,
        }, {
          name: "Topic",
          value: `${channel.topic || "No topic"}`,
          inline: false,
        }, {
          name: "Creation Date",
          value: `${format.prettyDate(channel.createdAt)} (${format.dateParse(new Date() / 1000 - channel.createdAt / 1000)} ago)`,
          inline: false,
        }, {
          name: "Other Info",
          value: channel.type == 2 ? `The voice channel's bitrate is ${channel.bitrate} and is limited to ${channel.userLimit == 0 ? "infinite" : channel.userLimit} users.` : `The channel ${channel.nsfw == true ? "is" : "isn't"} NSFW, and it's in position ${channel.position}.`,
          inline: false,
        }],
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = channelinfoCommand;
