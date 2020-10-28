const Command = require("../../lib/Command");
const Booru = require("booru");

class safebooruCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["sb"],
      description: "Displays an image from Safebooru.",
      usage: "<tags>",
      cooldown: 3000,
      allowdms: true,
      nsfw: true,
    });
  }

  async run(msg, args) {
    // Handler for if the user gave more than two tags
    if (args.length > 2) return msg.channel.createMessage(this.bot.embed("❌ Error", "You can't search for more than 3 tags at a time on Safebooru.", "error"));

    // Randomly searches safebooru if no arguments are given
    if (!args[0]) {
      Booru.search("safebooru", ["rating: 's'"], { limit: 100, random: true })
        .then(posts => {
          for (let post of posts) post.fileUrl, post.postView;
        });
    } else {
      // Searches safebooru with the tags the author provided
      Booru.search("safebooru", args.join(" "), { limit: 100, random: true })
        .then(posts => {
          for (let post of posts) post.fileUrl, post.postView;
        });
    }

    // Posts the image using the tags given. Otherwise, just post a random image
    const posts = await Booru.search("safebooru", encodeURIComponent(args.join(" ")), { limit: 100, random: true });

    // Sends an error if nothing is found
    if (!posts[0]) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Handler for if the file is a video
    if (posts[0].fileUrl.endsWith(".webm") || posts[0].fileUrl.endsWith(".mp4")) return msg.channel.createMessage(this.bot.embed("❌ Error", `The image found is a video, so it can't be embedded. View the video [here](${posts[0].fileUrl}).`, "error"));

    // Sends the embed
    await msg.channel.createMessage({
      embed: {
        title: "🖼 Safebooru",
        image: {
          url: posts[0].fileUrl,
        },
        // Safebooru's logo colour hex
        color: 0x9cc2d5,
      },
    });
  }
}


module.exports = safebooruCommand;
