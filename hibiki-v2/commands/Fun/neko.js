const Command = require("../../lib/Command");
const Taihou = require("taihou");
const { weebsh } = require("../../config");
let weebSH = new Taihou(weebsh, true, { userAgent: "Hibiki" });

class nekoCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["catgirl", "kitsune"],
      description: "Posts a picture of a catgirl.",
      cooldown: 3000,
    });
  }

  run(msg) {
    // Gets the neko tag from weebSH
    weebSH.images.getRandomImage("neko")
      // Sends the embed
      .then(image => msg.channel.createMessage({
        embed: {
          title: "🐾 Mew!",
          image: {
            url: image.url,
          },
          color: require("../../utils/Colour")("general"),
        },
      }));
  }
}

module.exports = nekoCommand;
