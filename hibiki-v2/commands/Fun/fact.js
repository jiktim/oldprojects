const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class factCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["randomfact", "uselessfact"],
      description: "Posts a random type of fact.",
      usage: "cat | dog | number <number> | useless",
      cooldown: "3000",
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Sets the APIs
    const apis = ["https://catfact.ninja/fact", "https://dog-api.kinduff.com/api/facts", `http://numbersapi.com/${encodeURIComponent(args.length && args[1] ? args[1] : Math.floor(Math.random() * 1337))}`, "https://useless-facts.sameerkumar.website/api"];
    // Sets the API names
    const apinames = ["cat", "dog", "number", "useless"];
    // Sets the API labels
    const apilabels = ["🐱 Cat Fact", "🐶 Dog Fact", "🔢 Number Fact", "🍀 Useless Fact"];
    // Randomly selects an API using Math
    let index = Math.floor(Math.random() * apis.length);
    // Sets the API
    if (args.length > 0 && apinames.filter(api => api.includes(args.join(" "))).length) index = apinames.indexOf(apinames.filter(api => api.includes(args.join(" ")))[0]);
    let api = apis[index];
    let apiname = apinames[index];
    let apilabel = apilabels[index];
    // Fetches the API
    let res = await fetch(api);
    let body;
    apiname == "number" ? body = await res.text().catch(() => {}) : body = await res.json().catch(() => {});

    // Sends the embed
    if (body) {
      // Sets the fact
      let fact = "";
      // Sends the first message
      let factmsg = await msg.channel.createMessage(this.bot.embed(apilabels[index], "Please wait...", "general"));
      // If the API is cat, send a catfact
      if (apiname == "cat") fact = body.fact;
      // If the API is dog, send a dogfact
      else if (apiname == "dog") fact = body.facts[0];
      // If the API is number, send a numberfact
      else if (apiname == "number") fact = body;
      // If the API is useless, send a uselessfact
      else if (apiname == "useless") fact = body.data;
      // Edits the original message
      factmsg.edit(this.bot.embed(apilabel, fact, "general"));
    } else {
      // Posts an error message if nothing is found or if the API is down
      msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });
    }
  }
}

module.exports = factCommand;
