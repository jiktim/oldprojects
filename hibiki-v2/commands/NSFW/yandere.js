const Command = require("../../lib/Command");
const Booru = require("booru");

class yandereCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["yd"],
      description: "Displays an image from Yandere.",
      usage: "<tags>",
      cooldown: 3000,
      allowdms: true,
      nsfw: true,
    });
  }

  async run(msg, args) {
    // Handler for if the user gave more than two tags
    if (args.length > 2) return msg.channel.createMessage(this.bot.embed("❌ Error", "You can't search for more than 3 tags at a time on yandere.", "error"));

    // Checks to see if the channel is marked as NSFW
    if (msg.channel.nsfw) {
      // Randomly searches yandere if no arguments are given
      if (!args[0]) {
        Booru.search("yandere", ["rating:explicit"], { limit: 100, random: true })
          .then(posts => {
            for (let post of posts) post.fileUrl, post.postView;
          });
      } else {
        // Searches yandere with the tags the author provided
        Booru.search("yandere", args.join(" "), { limit: 10000, random: true })
          .then(posts => {
            for (let post of posts) post.fileUrl, post.postView;
          });
      }

      // Posts the image using the tags given. Otherwise, just post a random image
      const posts = await Booru.search("yandere", encodeURIComponent(args.join(" ")), { limit: 10000, random: true });
      if (!posts[0]) return msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });

      // Handler for if the file is a video
      if (posts[0].fileUrl.endsWith(".webm", ".mp4")) return msg.channel.createMessage(this.bot.embed("❌ Error", `The image found is a video, so it can't be embedded. View the video [here](${posts[0].fileUrl}).`, "error"));

      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: "🖼 Yandere",
          image: {
            url: posts[0].fileUrl,
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


module.exports = yandereCommand;
