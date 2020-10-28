const Command = require("../../lib/Command");
const Booru = require("booru");

class hypnohubCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["hh", "hypno", "hypo"],
      description: "Displays an image from Hypnohub.",
      usage: "<tags>",
      cooldown: 3000,
      allowdms: true,
      nsfw: true,
    });
  }

  async run(msg, args) {
    // Handler for if the user gave more than two tags
    if (args.length > 2) return msg.channel.createMessage(this.bot.embed("❌ Error", "You can't search for more than 3 tags at a time on HypnoHub.", "error"));

    // Checks to see if the channel is marked as NSFW
    if (msg.channel.nsfw) {
      // Randomly searches hypnohub if no arguments are given
      if (!args[0]) {
        Booru.search("hypnohub", ["rating: 'e'"], { limit: 100, random: true })
          .then(posts => {
            for (let post of posts) post.fileUrl, post.postView;
          });
      } else {
        // Searches hypnohub with the tags the author provided
        Booru.search("hypnohub", args.join(" "), { limit: 10000, random: true })
          .then(posts => {
            for (let post of posts) post.fileUrl, post.postView;
          });
      }

      // Posts the image using the tags given. Otherwise, just post a random image
      const posts = await Booru.search("hypnohub", encodeURIComponent(args.join(" ")), { limit: 10000, random: true });
      if (!posts[0]) return msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });

      // removes webm & mp4 because of embed limitations
      if (posts[0].fileUrl.endsWith(".webm") || posts[0].fileUrl.endsWith(".mp4")) return msg.channel.createMessage(this.bot.embed("❌ Error", `The image found is a video, so it can't be embedded. View the video [here](${posts[0].fileUrl}).`, "error"));

      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: "🔞 Hypnohub",
          image: {
            url: posts[0].fileUrl,
          },
          // Hypnohubs logo hex colour
          color: 0xe25751,
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

module.exports = hypnohubCommand;
