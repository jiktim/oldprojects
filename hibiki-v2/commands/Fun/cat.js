const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class catCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["kitten", "kitty", "pussy", "randomcat"],
      description: "Posts a random cat picture.",
      cooldown: 3000,
    });
  }

  async run(msg) {
    // Fetches the API
    let res = await fetch("http://aws.random.cat/meow");
    let body = await res.json().catch(() => {});

    // Sends the embed
    if (body) {
      await msg.channel.createMessage({
        embed: {
          title: "🐱 Meow!",
          image: {
            url: body.file,
          },
          color: require("../../utils/Colour")("general"),
        },
      });
    } else {
      // Posts an error message if nothing is found or if the API is down
      msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });
    }
  }
}

module.exports = catCommand;
