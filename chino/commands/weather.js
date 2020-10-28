const Command = require("../lib/Command");
var weather = require("weather-js");
const {
	CommandCategories,
} = require("../lib/Constants");
class weatherCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<location>",
			category: CommandCategories.MISC,
			description: "Gives basic weather details for an area.",
			aliases: ["forecast", "temperature", "humidity", "windspeed", "skystatus"],
		});
	}
	// Grabs the user's input.
	async run(msg, args) {
		weather.find({
			search: args.join(" "),
			degreeType: "C",
		// Unknown location handler
		}, (err, result) => {
			if (err || result.length == 0) {
				msg.channel.createMessage({
					embed: this.errembed({
						title: "Error!",
						description: "Unknown location.",
					}),
				});
			} else {
				var weather = result[0];

				msg.channel.createMessage({
					embed: this.embed({
						title: `Weather for ${weather.location.name}`,
						fields: [{
							name: "🌡 Temperature",
							value: `${weather.current.temperature}°C`,
							inline: true,
						}, {
							name: "☀️ Feels Like",
							value: `${weather.current.feelslike}°C`,
							inline: true,
						}, {
							name: "💧 Humidity",
							value: `${weather.current.humidity}%`,
							inline: true,
						}, {
							name: "💨 Wind Speed",
							value: `${weather.current.winddisplay}`,
							inline: true,
						}, {
							name: "🌇 Status",
							value: `${weather.current.skytext}`,
							inline: true,
						}, {
							name: "🗓️ Local Date",
							value: `${weather.current.date}`,
							inline: true,
						}],
					}),
				});
			}
		});
	}
}

module.exports = weatherCommand;
