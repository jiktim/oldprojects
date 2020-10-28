const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class garfieldCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.FUN,
			description: "Posts a random Garfield comic.",
			allowdisable: true,
		});
	}

	async run(msg, args) {
		function GarfieldRandom() {
			let month = Math.floor(Math.random() * 12) + 1;
			var day;
			// Since not all months have equal days, we will have to do if checks (havent found a better solution yet).
			if (month === 2) {
				// This month has 28 days.
				var day = Math.floor(Math.random() * 29) + 1;
			}
			if (month === 4 || month === 6 || month === 9 || month === 11) {
				// All of these months have 30 days
				var day = Math.floor(Math.random() * 30) + 1;
			}
			if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
				// All of these months have 31 days.
				var day = Math.floor(Math.random() * 31) + 1;
			}
			let todayYear = today.getFullYear();
			// Get a random year from 1978 to today.
			let randomYear = Math.floor(Math.random() * (todayYear - 1978) + 1978);
			let randomizedMonth = (month < 9 ? "0" : "") + month;
			let randomizedDay = (day < 9 ? "0" : "") + day;
			let archive = "https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/";
			let url = `${archive + randomYear}/${randomYear}-${randomizedMonth}-${randomizedDay}.gif`;
			let garfield = [url, randomYear, randomizedMonth, randomizedDay];
			return garfield;
		}
		// June 19, 1978 is when Garfield started.
		var start = new Date("1978-06-19");
		var today = new Date();
		var dayLength = 24 * 60 * 60 * 1000;
		// Do math to get the total number of comics.
		var comicCount = Math.round(Math.abs((start.getTime() - today.getTime()) / dayLength));
		const garfield = GarfieldRandom();
		msg.channel.createMessage({
			embed: {
				title: `Comics Available: ${comicCount}`,
				color: 0x7289DA,
				footer: {
					text: `${garfield[1]}-${garfield[2]}-${garfield[3]}`,
				},
				image: {
					url: garfield[0],
				},
			},
		});
	}
}

module.exports = garfieldCommand;
