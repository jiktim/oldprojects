const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class removemeritCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<ids>",
			category: CommandCategories.FUN,
			description: "Removes a merit from a user.",
			aliases: ["removemerits", "rmmerits", "rmmerit", "unmerit, reprem, remrep"],
			requiredPerms: "manageMessages",
			allowdisable: true,
		});
	}
	// Checks for valid IDs
	async run(msg, meritIDs) {
		if (!meritIDs.length) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You have to provide a merit ID.",
				}),
			});
			return;
		}
		// Deletes the merit
		const meritSuccess = await Promise.all(meritIDs.map(async meritID => {
			if (isNaN(meritID)) {
				return { success: false, meritID };
			}
			const id = await this.db.table("merits").get(meritID);
			if (!id) {
				return { success: false, meritID };
			}
			await this.db.table("merits").get(meritID).delete();
			return { success: true, meritID };
		}));

		// Error
		const trueMerits = meritSuccess.filter(b => b.success);
		const falseMerits = meritSuccess.filter(b => !b.success);
		if (!trueMerits.length) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `I wasn't able to remove any merits you have provided.`,
				}),
			});
		} else {
			// Remove merits & errors if needed
			this.bot.emit("meritRemove", msg.guild, msg.member, trueMerits.map(m => m.meritID));
			await msg.channel.createMessage({
				embed: this.embed({
					title: `I removed ${trueMerits.length} merit(s).`,
					description: `${trueMerits.map(m => m.meritID).join(", ")}`,
					fields: falseMerits.length ? [{
						name: `I have failed to remove some merits though.`,
						value: `Here are their IDs: ${falseMerits.map(m => m.meritID).join(", ")}`,
					}] : [],
				}),
			});
		}
	}
}

module.exports = removemeritCommand;
