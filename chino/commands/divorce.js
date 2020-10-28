const Command = require("../lib/Command");
const {
	get,
} = require("snekfetch");
const {
	CommandCategories,
} = require("../lib/Constants");
const {
	inspect,
} = require("util");
class divorceCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.MISC,
			usage: "<user>",
			description: "Divorces you from the user you married.",
			aliases: ["unmarry", "demarry"],
			allowdisable: true,
		});
	}
	// Gets the user's marriage status from the marriageIndex.
	async run(msg) {
		const [marriageState] = await this.db.table("marry").getAll(msg.author.id, {
			index: "marriageIndex",
		});
		// If nothing is in the DB about the user
		if (!marriageState) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You aren't married!",
				}),
			});
			return;
		}
		// Deletes the marriage IDs from the DB & divorces the users.
		await this.db.table("marry").get(marriageState.id).delete();
		await msg.channel.createMessage({
			embed: this.embed({
				title: "Divorce",
				description: `Good luck in the future, <@!${marriageState.id === msg.author.id ? marriageState.marriedTo : marriageState.id}> and <@!${marriageState.id === msg.author.id ? marriageState.id : marriageState.marriedTo}>.`,
			}),
		});
	}
}

module.exports = divorceCommand;
