const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class foxCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["floof", "randomfox"],
      description: "Posts a random fox picture.",
      cooldown: 3000,
    });
  }

  async run(msg) {
    // Fetches the API
    let res = await fetch("https://randomfox.ca/floof/");
    let body = await res.json().catch(() => {});

    if (body) {
      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: "🦊 Floof!",
          image: {
            url: body.image,
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

module.exports = foxCommand;
