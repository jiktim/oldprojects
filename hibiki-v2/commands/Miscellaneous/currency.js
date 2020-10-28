const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class currencyCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Converts money from one currency to another",
      aliases: ["convert", "convertmoney"],
      usage: "<amount> <from> <to>",
    });
  }

  async run(msg, [amount, from, to]) {
    // Handler for if the amount isn't a number
    if (isNaN(amount)) {
      to = from;
      from = amount;
    }

    // Handler for if no arguments were given
    if (!from || !to) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Fetches the API
    let res = await fetch(`https://api.exchangeratesapi.io/latest?base=${encodeURIComponent(from.toUpperCase())}&symbols=${encodeURIComponent(to.toUpperCase())}`).catch(() => {});
    let body = await res.json().catch(() => {});

    // Handler for if there's no body
    if (!body) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Handler for if the body returns an undefined error
    if (body.error != undefined) return msg.channel.createMessage({
      embed: msg.errorembed("errorNF"),
    });

    // Sends the embed
    if (isNaN(amount)) {
      msg.channel.createMessage(this.bot.embed(`💱 Conversion rates for ${body.base} to ${to.toUpperCase()}`, `${Object.keys(body.rates).map(k => `**${k}**: ${body.rates[k].toFixed(2)}`).join("\n")}`, "general"));
    } else {
      msg.channel.createMessage(this.bot.embed("💱 Currency", `**${amount}** ${body.base} ~ **${amount * body.rates[to.toUpperCase()].toFixed(2)}** ${to.toUpperCase()}`, "general"));
    }
  }
}

module.exports = currencyCommand;
