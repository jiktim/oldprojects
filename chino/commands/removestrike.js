const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class removestikeCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<ids>",
			category: CommandCategories.MODERATION,
			description: "Removes a strike from a user.",
			aliases: ["removestrikes", "rmstrikes", "rmstrike"],
			requiredPerms: "kickMembers",
			allowdisable: true,
		});
	}
	// Checks for valid IDs
	async run(msg, strikeIDs) {
		if (!strikeIDs.length) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You have to provide a strike ID.",
				}),
			});
			return;
		}
		// Deletes the strike
		const strikeSuccess = await Promise.all(strikeIDs.map(async strikeID => {
			const id = await this.db.table("strikes").get(strikeID);
			if (!id) {
				return { success: false, strikeID };
			}
			await this.db.table("strikes").get(strikeID).delete();
			return { success: true, strikeID };
		}));

		// Error
		const trueMerits = strikeSuccess.filter(b => b.success);
		const falseMerits = strikeSuccess.filter(b => !b.success);
		if (!trueMerits.length) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `I wasn't able to remove any strikes you have provided.`,
				}),
			});
		} else {
			// Removes the strike & errors if needed
			this.bot.emit("strikeRemove", msg.guild, msg.member, trueMerits.map(m => m.strikeID));
			await msg.channel.createMessage({
				embed: this.embed({
					title: `I removed ${trueMerits.length} strike(s).`,
					description: `${trueMerits.map(m => m.strikeID).join(", ")}`,
					fields: falseMerits.length ? [{
						name: `I have failed to remove some strikes though.`,
						value: `Here are their IDs: ${falseMerits.map(m => m.strikeID).join(", ")}`,
					}] : [],
				}),
			});
		}
	}
}

module.exports = removestikeCommand;
