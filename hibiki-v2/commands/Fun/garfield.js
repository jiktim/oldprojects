const Command = require("../../lib/Command");

class garfieldCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["funnycat"],
      description: "Posts a random Garfield comic.",
      cooldown: 3000,
    });
  }

  run(msg) {
    // Sets today's date
    let today = new Date();
    // Random Garfield comic function
    function GarfieldRandom() {
      // Date when the first Garfield comic was released
      let start = new Date("1978/06/19").getTime();
      let date = new Date(start + Math.random() * (today.getTime() - start));

      function pad(n) {
        return n < 10 ? `0${n}` : n;
      }

      // Sets the URL for pulling the images
      let archive = "https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/";
      // Sets the random image URL
      let url = `${archive + date.getFullYear()}/${date.getFullYear()}-${pad(date.getMonth())}-${pad(date.getDate())}.gif`;
      // Sets the garfield args
      let garfield = [url, date.getFullYear(), pad(date.getMonth()), pad(date.getDate())];
      return garfield;
    }

    // Randomly selects a Garfield comic
    const garfield = GarfieldRandom();
    // Handler in case an error happened with the archive
    if (!garfield[0]) return msg.channel.createMessage(this.bot.embed("❌ Error", "An error happened while fetching the comic. Try again later.", "error"));

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: "💭 Garfield",
        image: {
          url: garfield[0],
        },
        footer: {
          icon_url: this.bot.user.dynamicAvatarURL("png", 1024),
          text: `Published on ${garfield[1]}-${garfield[2]}-${garfield[3]}`,
        },
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = garfieldCommand;
