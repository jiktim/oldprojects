const Command = require("../../lib/Command");
const booru = require("booru");

class danbooruCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["dan", "db", "donmai"],
      description: "Displays an image from Danbooru.",
      usage: "<tags>",
      cooldown: 3000,
      allowdms: true,
      nsfw: true,
    });
  }

  async run(msg, args) {
    // Handler for if the user gave more than two tags
    if (args.length > 1) return msg.channel.createMessage(this.bot.embed("❌ Error", "You can't search for more than 2 tags at a time on Danbooru.", "error"));

    // Checks to see if the channel is marked as NSFW
    if (msg.channel.nsfw) {
      // Randomly searches danbooru if no arguments are given
      if (!args[0]) {
        booru.search("danbooru", ["rating:explicit"], { limit: 100, random: true })
          .then(posts => {
            for (let post of posts) post.fileUrl, post.postView;
          });
      } else {
        // Searches danbooru with the tags the author provided
        booru.search("danbooru", args.join(" "), { limit: 10000, random: true })
          .then(posts => {
            for (let post of posts) post.fileUrl, post.postView;
          });
      }

      // Posts the image using the tags given. Otherwise, just post a random image
      const posts = await Booru.search("danbooru", args.join(" "), { limit: 10000, random: true });
      if (!posts[0] || !posts[0].fileUrl) return msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });

      // Removes webm & mp4 because of embed limitations
      if (posts[0].fileUrl.endsWith(".webm") || posts[0].fileUrl.endsWith(".mp4")) return msg.channel.createMessage(this.bot.embed("❌ Error", `The image found is a video, so it can't be embedded. View the video [here](${posts[0].fileUrl}).`, "error"));

      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: "🖼 Danbooru",
          image: {
            url: posts[0].fileUrl,
          },
          color: require("../../utils/Colour")("general"),
        },
      });
    } else {
      // Posts an error message if nothing is found or if something else happens
      await msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });
    }
  }
}


module.exports = danbooruCommand;
