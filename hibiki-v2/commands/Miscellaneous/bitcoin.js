const Command = require("../../lib/Command");
const fetch = require("node-fetch");

class bitcoinCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["bitcoinavg", "btc", "btcrate"],
      description: "Checks the average Bitcoin rate or an address.",
      usage: "<address>",
      cooldown: 3000,
    });
  }

  async run(msg, args) {
    // If no arguments were given
    if (!args.length) {
      // Fetches the API
      let res = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json");
      let body = await res.json().catch(() => {});

      // Sends the embed
      if (body) {
        msg.channel.createMessage({
          embed: {
            title: "💰 Bitcoin Averages",
            description: `Last updated at ${body.time.updateduk}.`,
            fields: [{
              name: "USD",
              value: body.bpi.USD.rate || "Unknown",
              inline: true,
            }, {
              name: "GBP",
              value: body.bpi.GBP.rate || "Unknown",
              inline: true,
            }, {
              name: "EUR",
              value: body.bpi.EUR.rate || "Unknown",
              inline: true,
            }],
            // Bitcoin's logo hex colour
            color: 0xf7931a,
          },
        });
      } else {
        // Posts an error message if nothing is found or if something else happens
        msg.channel.createMessage({
          embed: msg.errorembed("errorNF"),
        });
      }
    } else {
      // Fetches the raw address
      let res = await fetch(`https://blockchain.info/rawaddr/${encodeURIComponent(args[0])}`);
      let body = await res.json().catch(() => {});

      if (body) {
        // Sends the embed
        msg.channel.createMessage({
          embed: {
            title: `💰 Bitcoin Status for ${args[0]}`,
            fields: [{
              name: "Total Balance",
              value: `${body.final_balance || 0} BTC`,
              inline: true,
            }, {
              name: "Total Received",
              value: `${Object.values(body)[3] || 0} BTC`,
              inline: true,
            }, {
              name: "Total Sent",
              value: `${body.total_sent || 0} BTC`,
              inline: true,
            }],
            // Bitcoin's logo hex colour
            color: 0xf7931a,
          },
        });
        // Posts an error message if nothing is found or if the API is down
      } else {
        msg.channel.createMessage({
          embed: msg.errorembed("errorNF"),
        });
      }
    }
  }
}

module.exports = bitcoinCommand;
