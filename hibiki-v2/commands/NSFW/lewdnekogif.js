const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class lewdnekogifCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["lewdcatgirlgif", "lewdkitsunegif"],
      description: "Posts a lewd gif of a catgirl.",
      cooldown: 3000,
      allowdms: true,
      nsfw: true,
    });
  }

  async run(msg) {
    // Fetches the API
    let res = await fetch("https://nekos.life/api/v2/img/nsfw_neko_gif");
    let body = await res.json().catch(() => {});

    if (body) {
      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: "🐾 Mew~",
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

module.exports = lewdnekogifCommand;
