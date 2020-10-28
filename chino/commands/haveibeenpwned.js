const Command = require("../lib/Command");
const request = require("snekfetch");
const {
	CommandCategories,
} = require("../lib/Constants");
class hibpCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.MISC,
			description: "Searches for a query on haveibeenpwned.com.",
			aliases: ["hibp", "pwned"],
			allowdisable: false,
		});
	}
	async run(msg, args) {
		try {
			// Gets the API.
			const accs = await request.get(`https://haveibeenpwned.com/api/v2/breachedaccount/${encodeURIComponent(args.join(" "))}`).set({ "User-Agent": "chinobot.host" });
			await msg.channel.createMessage({
			// Embed & posts data
				embed: this.embed({
					title: `HaveIBeenPwned`,
					fields: accs.body.map(acc => ({
						name: `${acc.Title}`,
						value: `Breached: ${acc.BreachDate}`,
					})),
				}),
			});
		// If nothing is found / errors out
		} catch (e) {
			if (e) {
				msg.channel.createMessage({
					embed: this.errembed({
						title: "Error!",
						description: "No information found.",
					}),
				});
			}
		}
	}
}

module.exports = hibpCommand;
