const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class lewdnekoCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["lewdcatgirl", "lewdkitsune"],
      description: "Posts a lewd image of a catgirl.",
      cooldown: 3000,
      allowdms: true,
      nsfw: true,
    });
  }

  async run(msg) {
    // Fetches the API
    let res = await fetch("https://nekos.life/api/lewd/neko");
    let body = await res.json().catch(() => {});

    if (body) {
      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: "🐾 Mew~",
          image: {
            url: body.neko,
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

module.exports = lewdnekoCommand;
