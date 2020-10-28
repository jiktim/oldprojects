const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class dailyCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.FUN,
			description: "Gives you your daily amount of cookies.",
			allowdisable: true,
		});
	}
	// Formats the time.
	async run(msg, args) {
		function timeFormat(ms) {
			let d, h, m, s;
			s = Math.floor(ms / 1000);
			m = Math.floor(s / 60);
			s %= 60;
			h = Math.floor(m / 60);
			m %= 60;
			d = Math.floor(h / 24);
			h %= 24;
			h += d * 24;
			return `${h} hours ${m} minutes and ${s} seconds`;
		}
		// Checks the user's lastclaim in the DB.
		let cookies = await this.db.table("cookies").get(msg.author.id);
		if (!cookies) {
			cookies = {
				id: msg.author.id,
				amount: 0,
				lastclaim: 9999,
			};
			await this.db.table("cookies").insert(cookies);
		}
		// If the lastclaim has expired, allow them to claim their cookies.
		if (new Date() - new Date(cookies.lastclaim) > 86400000) {
			var amount2add = cookies.amount + Math.floor(Math.random() * 112) + 50;
			cookies = {
				id: msg.author.id,
				amount: amount2add,
				lastclaim: new Date(),
			};
			await this.db.table("cookies").get(msg.author.id).update(cookies);
			msg.channel.createMessage({
				embed: this.embed({
					title: `Daily Cookies`,
					description: `You have claimed your daily cookies!`,
				}),
			});
		// If the lastclaim has not expired, post the amount of time needed until they can claim their daily cookies.
		} else {
			const lastclaim = new Date(cookies.lastclaim);
			const time = timeFormat(86400000 - (new Date().getTime() - lastclaim.getTime()));
			msg.channel.createMessage({
				embed: this.embed({
					title: `Daily Cookies`,
					description: `You can claim your daily cookies in: ${time}.`,
				}),
			});
		}
	}
}

module.exports = dailyCommand;
