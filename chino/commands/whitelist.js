const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class whitelistCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user>",
			category: CommandCategories.OWNER,
			description: "Removes a user or guild from the blacklist.",
			allowdisable: false,
		});
	}
	async run(msg, args) {
		// Checks if the arguments provided are a number.
		if (isNaN(args[0])) {
			// Check if there are multiple arguments (if there are multiple arguments, the user is trying to whitelsit a guild)
			if (!args[1]) return;
			if (isNaN(args[1])) return;
			// Deletes the entry from the DB.
			await this.db.table("blacklist").filter({
				guild: args[1],
			}).delete();
			msg.channel.createMessage({
				embed: this.succembed({
					title: `Success!`,
					description: `Whitelisted guild.`,
				}),
			});
		} else {
			// Deletes the entry from the DB.
			await this.db.table("blacklist").filter({
				user: args[0],
			}).delete();
			msg.channel.createMessage({
				embed: this.succembed({
					title: `Success!`,
					description: `Whitelisted user.`,
				}),
			});
		}
	}
}

module.exports = whitelistCommand;
