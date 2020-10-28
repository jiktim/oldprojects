const Command = require("../../lib/Command");
const fetch = require("node-fetch");

// Sets the ISOcodes
let ISOcodes = ["auto", "af", "sq", "am", "ar", "hy", "az", "eu", "be", "bn", "bs", "bg", "ca", "ceb", "ny", "zh-cn", "zh-tw", "co", "hr", "cs", "da", "nl", "en", "eo", "et", "tl", "fi", "fr", "fy", "gl", "ka", "de", "el", "gu", "ht", "ha", "haw", "iw", "hi", "hmn", "hu", "is", "ig", "id", "ga", "it", "ja", "jw", "kn", "kk", "km", "ko", "ku", "ky", "lo", "la", "lv", "lt", "lb", "mk", "mg", "ms", "ml", "mt", "mi", "mr", "mn", "my", "ne", "no", "ps", "fa", "pl", "pt", "ma", "ro", "ru", "sm", "gd", "sr", "st", "sn", "sd", "si", "sk", "sl", "so", "es", "su", "sw", "sv", "tg", "ta", "te", "th", "tr", "uk", "ur", "uz", "vi", "cy", "xh", "yi", "yo", "zu"];

class translateCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["translatetext"],
      description: "Translates text between languages.",
      usage: "<language> <text>",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Sets the default locale as english
    let locale = "en";
    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Checks to see if it's a valid locale
    if (args[0].toLowerCase().startsWith("se ")) {
      locale = "sv";
      args.shift();
    } else if (args[0].toLowerCase().startsWith("jp ")) {
      locale = "ja";
      args.shift();
    } else if (args[0].toLowerCase().startsWith("br ")) {
      locale = "pt";
      args.shift();
    }

    // Sets the locale
    if (ISOcodes.includes(args[0].toLowerCase())) {
      locale = args.shift().toLowerCase();
    }

    // Fetches the API
    let res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${locale}&dt=t&q=${encodeURIComponent(args.join(" "))}`);
    let result = await res.json().catch(() => {});

    // Handler for if no results were found
    if (!result || !result[0] || !result[0][0] || !result[0][0][1] || !result[2]) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Sends the embed
    msg.channel.createMessage(this.bot.embed("🌍 Translate", `${result[0][0][1]} **(${result[2].toUpperCase()})** => ${result[0][0][0]} **(${locale.toUpperCase()})**`, "general")).catch(() => {});
  }
}

module.exports = translateCommand;
