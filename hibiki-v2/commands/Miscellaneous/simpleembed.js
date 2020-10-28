const Command = require("../../lib/Command");

class simpleembedCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["eembed", "easyembed", "sembed"],
      description: "Creates a simple embed.",
      usage: "<text> <imageURL> <hex>",
      requiredperms: "manageMessages",
      cooldown: 3000,
      staff: true,
    });
  }

  run(msg, args) {
    let imgurl;
    // Grabs the user's input
    args = args.join(" ");
    // URL checker regex
    let urlcheck = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.exec(args);
    if (urlcheck) args = args.slice(0, urlcheck.index) + args.slice(urlcheck.index + urlcheck[0].length, args.length);
    if (urlcheck) imgurl = urlcheck[0];
    // Sets the image as the proxy url
    if (!imgurl && msg.attachments && msg.attachments[0]) imgurl = msg.attachments[0].proxy_url;
    // Sets the image as the user's profile picture of they didn't provide an image URL
    if (!imgurl) imgurl = msg.member.user.dynamicAvatarURL(null, 1024);
    // Regex for the hex code - removes any hexes from the embed body also
    let hexcheck = /#([A-Fa-f0-9]{5,6})/.exec(args);
    if (hexcheck && !args.startsWith("<#")) args = args.slice(0, hexcheck.index) + args.slice(hexcheck.index + hexcheck[0].length, args.length);

    // Error handler if no arguments are given
    if (!args[0]) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: msg.member.nick || msg.author.username,
        description: args,
        thumbnail: {
          url: imgurl ? imgurl : null,
        },
        color: hexcheck && !args.startsWith("<#") ? parseInt(hexcheck[0].replace("#", "0x")) : 0xCE94D3,
      },
    });
  }
}

module.exports = simpleembedCommand;
