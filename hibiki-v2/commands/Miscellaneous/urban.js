const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class urbanCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["ud", "urbandic", "urbandictionary"],
      description: "Defines a word from the Urban Dictionary.",
      usage: "<word>",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Handler for if no arguments are given
    if (!args[0]) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Fetches the API
    let res = await fetch(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(args.join(" "))}`);
    let body = await res.json().catch(() => {});
    if (!body || !res) return msg.channel.createMessage(this.bot.embed("❌ Error", "The urban dictionary API is down.", "error"));
    // Sets the word as the first in the list
    const udword = body.list[1];
    // Handler for if no word is found
    if (!udword) return msg.channel.createMessage(this.bot.embed("❌ Error", "Word not found.", "error"));
    // Handler for if the definition is over the embed limit
    if (udword.definition.length > 1024) return msg.channel.createMessage(this.bot.embed("❌ Error", `The entry is over 1024 characters. View it directly [here](https://www.urbandictionary.com/define.php?term=${args}).`, "error"));

    if (udword) {
      // Sends the embed
      msg.channel.createMessage({
        embed: {
          title: `📔 ${udword.word}`,
          fields: [{
            name: "Definition",
            value: udword.definition.replace(/[[\]]/g, "") || "No definition",
            inline: false,
          }, {
            name: "Example",
            value: udword.example.replace(/[[\]]/g, "") || "No example",
            inline: false,
          }, {
            name: "Upvotes",
            value: udword.thumbs_up || "0",
            inline: true,
          }, {
            name: "Downvotes",
            value: udword.thumbs_down || "0",
            inline: true,
          }],
          // Urban dictionary's hex colour
          color: 0x1d2439,
        },
      });
    } else {
      // Posts an error message if nothing is found or if something else happens
      msg.channel.createMessage(this.bot.embed("❌ Error", "Word not found.", "error"));
    }
  }
}

module.exports = urbanCommand;
