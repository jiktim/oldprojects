const Command = require("../../lib/Command");
const fetch = require("node-fetch");
const config = require("../../config");

class weatherCommand extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["forecast", "humidity", "skystatus", "temp", "temperature", "windspeed"],
      description: "Displays current weather information for an area.",
      usage: "<location>",
      cooldown: 3000,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Sends if no args were given
    if (!args.length) return msg.channel.createMessage({
      embed: msg.errorembed("noArguments"),
    });

    // Fetches the API
    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(args.join(" "))}&units=metric&APPID=${config.weather}`);
    let body = await res.json().catch(() => {});

    // Handler for if the location isn't found
    if (body.cod !== 200) return await msg.channel.createMessage(this.bot.embed("❌ Error", "Location not found.", "error"));

    if (body) {
      // Sends the embed
      msg.channel.createMessage({
        embed: {
          title: `☁ Weather for ${body.name}, ${body.sys.country || "Unknown"}`,
          description: "Information may be slightly behind.",
          fields: [{
            name: "🌡 Temperature",
            value: `${body.main.temp.toFixed(0) || "Unknown"}°c`,
            inline: true,
          }, {
            name: "☀ High",
            value: `${body.main.temp_max.toFixed(0) || "Unknown"}°c`,
            inline: true,
          }, {
            name: "🌙 Low",
            value: `${body.main.temp_min.toFixed(0) || "Unknown"}°c`,
            inline: true,
          }, {
            name: "💦 Humidity",
            value: `${body.main.humidity || "Unknown"}%`,
            inline: true,
          }, {
            name: "🌤 Status",
            value: `${body.weather[0].main || "Unknown"}`,
            inline: true,
          }, {
            name: "💨 Wind Speed",
            value: `${body.wind.speed.toFixed(0) || "Unknown"}kph`,
            inline: true,
          }],
          color: require("../../utils/Colour")("general"),
        },
      });
    } else {
      // Posts an error message if nothing is found or if something else happens
      msg.channel.createMessage({
        embed: msg.errorembed("errorNF"),
      });
    }
  }
}

module.exports = weatherCommand;
