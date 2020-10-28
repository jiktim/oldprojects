const Command = require("../../lib/Command");
const Booru = require("booru");

class gelbooruCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["gb", "gel"],
      description: "Displays an image from Gelbooru.",
      usage: "<tags>",
      cooldown: 3000,
      allowdms: true,
      nsfw: true,
    });
  }

  async run(msg, args) {
    // Checks to see if the channel is marked as NSFW
    if (msg.channel.nsfw) {
      // Randomly searches gelbooru if no arguments are given
      if (!args[0]) {
        Booru.search("gelbooru", ["rating: 'e'"], { limit: 100, random: true })
          .then(posts => {
            for (let post of posts) post.fileUrl, post.postView;
          });
      } else {
        // Searches gelbooru with the tags the author provided
        Booru.search("gelbooru", args.join(" "), { limit: 100, random: true })
          .then(posts => {
            for (let post of posts) post.fileUrl, post.postView;
          });
      }

      // Posts the image using the tags given. Otherwise, just post a random image
      const posts = await Booru.search("gelbooru", encodeURIComponent(args.join(" ")), { limit: 100, random: true });
      if (!posts[0]) return msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });

      // Removes webm & mp4 because of embed limitations
      if (posts[0].fileUrl.endsWith(".webm") || posts[0].fileUrl.endsWith(".mp4")) return msg.channel.createMessage(this.bot.embed("❌ Error", `The image found is a video, so it can't be embedded. View the video [here](${posts[0].fileUrl}).`, "error"));

      // Sends the embed
      await msg.channel.createMessage({
        embed: {
          title: "🖼 Gelbooru",
          image: {
            url: posts[0].fileUrl,
          },
          // Gelbooru's logo hex colour
          color: 0x0773fb,
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

module.exports = gelbooruCommand;
