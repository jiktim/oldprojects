const Command = require("../../lib/Command");

class emojiCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["emote", "enlarge"],
      description: "Enlarges an emoji.",
      usage: "<:emoji:>",
    });
  }

  run(msg, args) {
    // Emoji ID regexes
    let emojiid = args.join("").split(/<a?:[a-zA-Z]{1,128}:([0-9]{17,18})>/).join("");
    let isAnimated = /<[a]:/g.test(args.join(""));

    // Codepoint function
    function toCodePoint(surrogate) {
      let characters = [],
        charCode = 0,
        sgFix = 0;
      for (let i = 0; i < surrogate.length; i++) {
        charCode = surrogate.charCodeAt(i);
        if (sgFix) {
          characters.push((0x10000 +
            (sgFix - 0xD800 << 10) +
            (charCode - 0xDC00)).toString(16));
          sgFix = 0;
        } else if (charCode >= 0xD800 &&
          charCode <= 0xDBFF) {
          sgFix = charCode;
        } else {
          characters.push(charCode.toString(16));
        }
      }
      // Joins the characters for the API
      return characters.join('-');
    }

    // Handler for if a bad emote was given
    if (!emojiid || isNaN(emojiid)) {
      // Unicode to emoji parsing
      if (/\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/.test(args[0])) {
        // Sends the embed
        msg.channel.createMessage({
          embed: {
            title: "😄 Emoji",
            image: {
              url: `https://twemoji.maxcdn.com/v/12.1.3/72x72/${toCodePoint(args[0])}.png`,
            },
            color: require("../../utils/Colour")("general"),
          },
        });
        return;
      }
      // Sends if an invalid emoji is given
      msg.channel.createMessage(this.bot.embed("❌ Error", "Invalid emoji.", "error"));
      return;
    }
    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: "😄 Emoji",
        image: {
          url: `https://cdn.discordapp.com/emojis/${emojiid}.${isAnimated ? "gif" : "png"}`,
        },
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = emojiCommand;
