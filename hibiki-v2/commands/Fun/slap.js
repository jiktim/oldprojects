const Command = require("../../lib/Command");
const Taihou = require("taihou");
const { weebsh } = require("../../config");
let weebSH = new Taihou(weebsh, true, { userAgent: "Hibiki" });

class slapCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Slaps another user.",
      usage: "<@user>",
      cooldown: 3000,
    });
  }

  run(msg, args) {
    // Checks to see if the author mentioned another user and if that user is valid
    let user = [];
    let member;
    if (args.length) member = msg.channel.guild.members.find(m => {
      if (msg.mentions.includes(m.user)) return m;
      if (m.id == args.join(" ")) return m;
      if (args.join(" ") == `<@${m.id}>`) return m;
      if (args.join(" ") == `<@!${m.id}>`) return m;
      if (m.username.toLowerCase().startsWith(args.join(" ").toLowerCase())) return m;
    });

    // Handler for if no member is mentioned.
    if (member) user = member.username;

    // Sends if an invalid member is mentioned
    if (!member) return msg.channel.createMessage({
      embed: msg.errorembed("userNotFound"),
    });

    // Handler for if the author mentions themselves
    if (!args[0] || member.id == msg.author.id) return msg.channel.createMessage(this.bot.embed("❌ Error", "Why are you hitting yourself? Idiot.", "error"));

    // Sends the embed
    weebSH.images.getRandomImage("slap")
      .then(image => msg.channel.createMessage({
        embed: {
          description: `🤚 **${user}** was slapped by **${msg.author.username}!**`,
          image: {
            url: image.url,
          },
          color: require("../../utils/Colour")("general"),
        },
      }));
  }
}

module.exports = slapCommand;
