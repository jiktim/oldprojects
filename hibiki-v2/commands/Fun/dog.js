const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class dogCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["puppy", "randomdog", "woof"],
      description: "Posts a random dog picture.",
      cooldown: 3000,
    });
  }

  async run(msg) {
    // Fetches the API
    let res = await fetch("https://dog.ceo/api/breeds/image/random");
    let body = await res.json().catch(() => {});

    // Sends the embed
    if (body) {
      await msg.channel.createMessage({
        embed: {
          title: "🐶 Woof!",
          image: {
            url: body.message,
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

module.exports = dogCommand;
