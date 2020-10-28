const Command = require("../../lib/Command");
const waitFor = require("../../utils/Timeout");

class embedCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["embedmessage", "embedmsg", "rembed", "richembed"],
      description: "Creates a custom embed message.",
      clientperms: "embedLinks",
      requiredperms: "manageMessages",
      cooldown: 5000,
      staff: true,
    });
  }

  async run(msg, args) {
    // Sets the emojis
    let emojis = [];
    // Sets the emoji actions
    let emojiactions = {
      "🇦": "title",
      "🇧": "description",
      "🖼": "image.url",
      "📷": "thumbnail.url",
      "👤": "author.name",
      "📸": "author.icon_url",
      "💬": "footer.text",
      "🎥": "footer.icon_url",
      "🖍": "color",
      "📅": "timestamp",
      "✅": "hibiki:done",
      "❌": "hibiki:cancel"
    };

    // Sets the emoji labels
    let emojilabels = {
      "title": "Title",
      "description": "Description",
      "image.url": "Image",
      "thumbnail.url": "Thumbnail",
      "author.name": "Author Text",
      "author.icon_url": "Author Image",
      "footer.text": "Footer Text",
      "footer.icon_url": "Footer Image",
      "color": "Colour",
      "timestamp": "Timestamp",
      "hibiki:done": "Done",
      "hibiki:cancel": "Cancel",
    };

    // Sets the emoji descriptions
    let emojidescriptions = {
      "title": "Title of the embed.",
      "description": "Main text of the embed.",
      "image.url": "Large image of the embed.",
      "thumbnail.url": "Thumbnail of the embed.",
      "author.name": "Text in the left corner.",
      "author.icon_url": "Image in the left corner.",
      "footer.text": "Text at the bottom.",
      "footer.icon_url": "Image at the bottom.",
      "color": "Hex colour of the embed.",
      "timestamp": "Adds a timestamp.",
      "hibiki:done": "Sends the embed.",
      "hibiki:cancel": "Closes this menu.",
    };

    // Prepares the embed
    let embed = {};
    // Adds the emojis to the emojis array
    Object.entries(emojiactions).forEach(e => emojis.push(e[0]));

    // Sends the first embed
    let embedmsg = await msg.channel.createMessage({
      embed: {
        title: "🖊 Embed",
        thumbnail: {
          url: "https://i.imgur.com/2LN0ni5.png",
        },
        // Emoji actions fields
        fields: Object.entries(emojiactions).map(e => {
          return {
            name: `${e[0]} ${emojilabels[e[1]] ? emojilabels[e[1]] : e[1]}`,
            value: emojidescriptions[e[1]] ? emojidescriptions[e[1]] : "No description",
            inline: true,
          };
        }),
        color: require("../../utils/Colour")("general"),
      },
    });

    // Adds reactions for each emoji added
    emojis.forEach(e => embedmsg.addReaction(e).catch(() => {}));
    // Sets a timeout for the reaction menu (30 seconds)
    await waitFor("messageReactionAdd", 120000, async (m, emoji, user) => {
      // Returns if the right message wasn't reacted to
      if (m.id != embedmsg.id) return false;
      // Returns if the message wasn't reacted to by the original author
      if (user != msg.author.id) return false;
      // Returns if the message was reacted with another emoji
      if (!emojiactions[emoji.name]) return false;
      // Sets the final emojiactions
      let e = emojiactions[emoji.name];
      // Returns true if reacted to with done
      if (e == "hibiki:done") return true;
      // Returns if reacted to with the cancel emoji
      if (e == "hibiki:cancel") {
        embedmsg.delete();
        embed = { error: "Embed cancelled." };
        return true;
      }

      // Removes the reaction from the message
      m.removeReaction(emoji.name, user).catch(() => {});
      if (e == "timestamp") { embed.timestamp = new Date(); return; }
      if (e.includes(".")) e = e.split(".");

      // Sends a prompt to the author
      embedmsg.edit(this.bot.embed("🖊 Embed", `Reply with the desired **${emojilabels[typeof e == "string" ? e : e.join(".")] ? `${emojilabels[typeof e == "string" ? e : e.join(".")][0].toLowerCase()}${emojilabels[typeof e == "string" ? e : e.join(".")].substring(1)}` : e[1]}**.`, "general"));
      let [resp] = await waitFor("messageCreate", 30000, async (message) => {
        // Returns if bad info is given
        if (message.author.id != msg.author.id) return false;
        if (message.channel.id != msg.channel.id) return false;
        message.delete().catch(() => {});
        return true;
      }, this.bot).catch(() => {});

      // Edits the embed message
      embedmsg.edit({
        embed: {
          title: "🖊 Embed",
          thumbnail: {
            url: "https://i.imgur.com/2LN0ni5.png",
          },
          // Sets the fields as the options
          fields: Object.entries(emojiactions).map(em => {
            return {
              name: `${em[0]} ${emojilabels[em[1]] ? emojilabels[em[1]] : em[1]}`,
              value: emojidescriptions[em[1]] ? emojidescriptions[em[1]] : "No description",
              inline: true,
            };
          }),
          color: require("../../utils/Colour")("general"),
        },
      }).catch(() => {});

      // Colour checker
      if (typeof e == "string" && e != "color" && e != "timestamp") embed[e] = resp.content;
      else if (e == "color") {
        // Sets the finalhex
        let finalhex;
        // Regex for the hex code
        let hexcheck = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/.exec(resp.content);
        // Sets args as hexcheck
        if (hexcheck) args = args.slice(0, hexcheck.index) + args.slice(hexcheck.index + hexcheck[0].length, args.length);
        // Error handler if no arguments are given or an invalid hex was given
        if (!hexcheck && isNaN(parseInt(`0x${args}`))) {
          // Sets the colour as the general colour if no/invalid colour was given
          finalhex = require("../../utils/Colour")("general");
        } else {
          if (!hexcheck) finalhex = parseInt(`0x${args}`);
          else finalhex = parseInt(hexcheck[0].replace("#", "0x"));
          // Hex limiter
          if (finalhex >= 16777215) {
            finalhex = 16777215;
          }
        }
        embed[e] = finalhex;
      } else {
        // Image checker
        if ((e[0] == "image" || e[0] == "thumbnail" || e[0] == "author" || e[0] == "footer") && (e[1] == "url" || e[1] == "icon_url") && resp.attachments && resp.attachments[0]) resp.content = resp.attachments[0].proxy_url;
        // Sets the obj
        let obj = {};
        if (embed[e[0]]) obj = embed[e[0]];
        obj[e[1]] = resp.content;
        embed[e[0]] = obj;
      }
    }, this.bot).catch(() => {});

    if (!Object.keys(embed).length || Object.keys(embed).includes("error")) {
      // Deletes the embed message
      embedmsg.delete().catch(() => {});
      // Errors out
      msg.channel.createMessage(this.bot.embed("❌ Error", embed.error ? embed.error : "Invalid embed.", "error"));
      return;
    }

    // Falls back to the default colour if no colour was given
    if (!embed.color) embed.color = require("../../utils/Colour")("general");
    // Sends the final embed
    msg.channel.createMessage({ embed: embed }).catch(() => {});
    // Deletes the original message
    embedmsg.delete().catch(() => {});
  }
}

module.exports = embedCommand;
