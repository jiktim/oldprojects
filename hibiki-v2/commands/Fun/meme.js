const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class memeCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["randomeme"],
      description: "Posts a random meme.",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg) {
    // Fetches the API
    let res = await fetch("https://meme-api.herokuapp.com/gimme");
    let body = await res.json().catch(() => {});

    if (body) {
      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: "🤣 Meme",
          image: {
            url: body.url,
          },
          color: require("../../utils/Colour")("general"),
        },
      });
    } else {
      // Posts an error message if nothing is found or if something else happens
      msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });
    }
  }
}

module.exports = memeCommand;
