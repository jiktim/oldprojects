const Command = require("../../lib/Command");
const fetch = require("node-fetch");
const config = require("../../config");

class defineCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["defineword", "dict", "dictionary"],
      description: "Gives the definition of a word from the dictionary.",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // If no API key is given
    if (!config.dictionary) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Fetches the API
    let res = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(args.join(" "))}?key=${config.dictionary}`);
    let body = await res.json().catch(() => {});

    if (!body[0].meta) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Empty body handler
    if (!body || !body[0].meta) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        title: "📕 Define",
        fields: [{
          name: "Word",
          value: `${args.join(" ")}`,
          inline: true,
        }, {
          name: "Category",
          value: `${body[0].fl || "No category"}`,
          inline: true,
        }, {
          name: "Stems",
          value: `${body[0].meta != undefined || body[0].meta.stems ? body[0].meta.stems.join(", ") : "None"}`,
          inline: true,
        }, {
          name: "Definition",
          value: `${body[0].shortdef[0] || "No definition"}`,
          inline: false,
        }],
        color: require("../../utils/Colour")("general"),
      },
    });
  }
}

module.exports = defineCommand;
