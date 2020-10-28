const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class xkcdCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Posts a random comic from XKCD.",
      cooldown: 3000,
    });
  }

  async run(msg) {
    let res;
    // Fetches the info file
    res = await fetch("http://xkcd.com/info.0.json");
    let newest = await res.json();
    // Handler in case an error happened with the archive
    if (!newest) return msg.channel.createMessage(this.bot.embed("❌ Error", "An error happened while fetching the comic. Try again later.", "error"));

    // Gets a random comic
    let random = Math.floor(Math.random() * newest.num) + 1;
    // Fetches the API
    res = await fetch(`https://xkcd.com/${random}/info.0.json`);
    let randomcomic = await res.json();

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: `💭 ${randomcomic.safe_title}`,
        description: `${randomcomic.alt}`,
        image: {
          url: randomcomic.img,
        },
        footer: {
          icon_url: this.bot.user.dynamicAvatarURL("png", 1024),
          text: `Published on ${randomcomic.day <= 10 ? `0${randomcomic.day}` : randomcomic.day}/${randomcomic.month <= 10 ? `0${randomcomic.month}` : randomcomic.day}/${randomcomic.year}`,
        },
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = xkcdCommand;
