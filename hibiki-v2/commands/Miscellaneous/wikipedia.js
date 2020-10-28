const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class wikipediaCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["wiki"],
      description: "Searches for something on Wikipedia.",
      usage: "<search>",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Fetches the API
    let out = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(args.join(" ").toLowerCase())}&prop=extracts&exintro&explaintext`);
    let wikioutput = await out.json();

    // Handler for if no arguments were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Handler for if the output gave -1
    if (wikioutput.query.pages["-1"]) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Sets the output
    let extract = Object.values(wikioutput.query.pages)[0].extract;
    let output = "";

    // Splits the output
    extract.split(".").map((x, i) => {
      if (i < 5) output = `${output}${x}.`;
    });

    // Handler for if junk output was returned
    if (!output || output == ".") return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Sets the length if it ends with ..
    if (output.endsWith("..")) {
      output = output.substring(0, output.length - 1);
    }

    // Sends the embed
    msg.channel.createMessage(this.bot.embed("📖 Wikipedia", `\`\`\`${output.replace(" (listen); ", "")}\`\`\``, "general"));
  }
}

module.exports = wikipediaCommand;
