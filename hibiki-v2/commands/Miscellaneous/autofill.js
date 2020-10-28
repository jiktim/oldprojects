const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class autofillCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["googleautofill"],
      description: "Sends a list of Google Autofill results.",
      usage: "<query>",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Fetches the API
    let body = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(args.join(" "))}`, {
      // Sets the headers
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36",
      }
    }).then(async res => await res.json().catch(() => {}));

    // Sends if there's no results
    if (!body || !body[1].length) return msg.channel.createMessage(this.bot.embed("❌ Error", "No results found.", "error"));
    // Sends the embed
    msg.channel.createMessage(this.bot.embed("✏ Autofill", body[1].join("\n"), "general"));
  }
}

module.exports = autofillCommand;
