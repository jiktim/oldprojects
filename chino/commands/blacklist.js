const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class blacklistCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user> | guild <guild>",
			category: CommandCategories.OWNER,
			description: "Blacklists a user or guild.",
			allowDisable: false,
		});
	}
	async run(msg, args) {
		// Check if the arguments provided are a number.
		if (isNaN(args[0])) {
			// Check if there are multiple arguments (if there are multiple arguments, the user is trying to whitelist a guild.)
			if (!args[1]) return;
			if (isNaN(args[1])) return;
			// Add an entry to the DB.
			await this.db.table("blacklist").insert({
				guild: args[1],
			});
			this.bot.guilds.find(o => o.id == args[1]).leave();
			msg.channel.createMessage({
				embed: this.succembed({
					title: `Success!`,
					description: `Blacklisted guild.`,
				}),
			});
		} else {
			// Add an entry to the DB.
			await this.db.table("blacklist").insert({
				user: args[0],
			});
			msg.channel.createMessage({
				embed: this.succembed({
					title: `Success!`,
					description: `Blacklisted user.`,
				}),
			});
		}
	}
}

module.exports = blacklistCommand;
