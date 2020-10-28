const Command = require("../../lib/Command");
const format = require("../../utils/Format");

class avatarCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["pfp", "profilepic", "profilepicture", "usericon"],
      description: "Displays a user's profile picture.",
      usage: "<@user>",
    });
  }

  async run(msg, args) {
    // Checks to see if the author mentioned another user and if that user is valid
    let member;
    if (args.length) member = msg.channel.guild.members.find(m => {
      if (msg.mentions.includes(m.user)) return m;
      if (m.id == args.join(" ")) return m;
      if (args.join(" ") == `<@${m.id}>`) return m;
      if (args.join(" ") == `<@!${m.id}>`) return m;
      if (m.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) return m;
    });

    // Sends the mentioned member's avatar
    if (member) {
      msg.channel.createMessage({
        embed: {
          author: {
            icon_url: member.user.dynamicAvatarURL(null, 1024),
            name: format.tag(member, false),
          },
          image: {
            url: member.user.dynamicAvatarURL(null, 1024),
          },
          color: require("../../utils/Colour")("general"),
        },
      });
    } else {
      // Sends the author's avatar
      msg.channel.createMessage({
        embed: {
          author: {
            icon_url: msg.member.user.dynamicAvatarURL(null, 1024),
            name: format.tag(msg.member, false),
          },
          image: {
            url: msg.member.user.dynamicAvatarURL(null, 1024),
          },
          color: require("../../utils/Colour")("general"),
        },
      });
    }
  }
}

module.exports = avatarCommand;
