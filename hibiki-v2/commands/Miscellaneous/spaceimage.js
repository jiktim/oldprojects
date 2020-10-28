const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class nasaCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["nasaimg", "spacephoto"],
      description: "Sends a space image from NASA.",
      usage: "<location>",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Sends a wait message
    let message = await msg.channel.createMessage(this.bot.embed("☄ Space Image", "Please wait, searching NASA's archive...", "general"));
    // Fetches the API
    let res = await fetch(`https://images-api.nasa.gov/search?media_type=image&q=${encodeURIComponent(args.join(" "))}`);
    let body = await res.json().catch(() => {});
    // Sets the images collection
    const images = body.collection.items;
    const data = images[Math.floor(Math.random() * images.length)];

    // Sends the embed
    if (data != undefined) {
      message.edit({
        embed: {
          title: "☄ Space Image",
          description: data.data[0].description.length > 2000 ? `${data.data[0].description.substring(0, 2000)}...` : data.data[0].description,
          image: {
            url: data.links[0].href,
          },
          color: require("../../utils/Colour")("general"),
        },
      });
    } else {
      // Posts an error message if nothing is found or if the API is down
      message.edit({
        embed: msg.errorembed("errorNF"),
      });
    }
  }
}

module.exports = nasaCommand;
