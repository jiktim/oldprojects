const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class coinflipCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<h or t>",
			category: CommandCategories.FUN,
			description: "Gamble your cookies by flipping a coin.",
			aliases: ["flip", "flipcoin", "flipacoin"],
			allowdisable: true,
		});
	}
	async run(msg, args) {
		let coin = "coin";
		let cookies = await this.db.table("cookies").get(msg.author.id);
		// Check if the amount of cookies the user has is less than 10.
		if (!cookies || cookies.amount < 5) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You don't have enough cookies.",
				}),
			});
			return;
		}
		// Randomly decides.
		if (args[0] && args[0].toLowerCase().startsWith("h")) coin = "heads";
		else if (args[0] && args[0].toLowerCase().startsWith("t")) coin = "tails";
		else coin = ["heads", "tails"][Math.floor(Math.random() * 2)];
		// Tails > 50%, Heads < 50%
		const random = Math.floor(Math.random() * 99) + 1;
		if (random < 50 && coin == "heads") {
			cookies.amount += 5;
			msg.channel.createMessage({
				embed: this.succembed({
					title: "Coinflip",
					description: "It landed on heads, you won **5** cookies!",
				}),
			});
			await this.db.table("cookies").get(msg.author.id).update(cookies);
		} else if (random > 50 && coin == "tails") {
			// Tails
			cookies.amount += 5;
			msg.channel.createMessage({
				embed: this.succembed({
					title: "Coinflip",
					description: "It landed on tails, you won **5** cookies!",
				}),
			});
			await this.db.table("cookies").get(msg.author.id).update(cookies);
		} else {
			// Random
			cookies.amount -= 5;
			msg.channel.createMessage({
				embed: this.errembed({
					title: "Coinflip",
					description: `It landed on ${random > 50 ? "tails" : "heads"}, you lost **5** cookies.`,
				}),
			});
		}
	}
}

module.exports = coinflipCommand;
