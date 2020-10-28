const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class rule34Command extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["paheal", "r34"],
      description: "Displays an image from Rule 34.",
      usage: "<tags>",
      cooldown: 3000,
      allowdms: true,
      nsfw: true,
    });
  }

  async run(msg, args) {
    // Fetches the API
    let res = await fetch(`https://r34-json-api.herokuapp.com/posts?tags=${args.join("%20")}`);
    let body = await res.json().catch(() => {});

    // Sends if nothing was found
    if (!body) return
    msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Randomly gets an image
    let random = Math.floor(Math.random() * body.length);
    // Sends the image
    if (typeof body[random] != "undefined") {
      await msg.channel.createMessage({
        embed: {
          title: "🔞 Rule 34",
          image: {
            url: body[random].file_url,
          },
          color: require("../../utils/Colour")("general"),
        },
      });
    } else {
      // No results
      msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });
      return;
    }
  }
}

module.exports = rule34Command;
