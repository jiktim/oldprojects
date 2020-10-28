const Command = require("../lib/Command");
const yn = require("../lib/askYesNo.js");
const {
	CommandCategories,
} = require("../lib/Constants");
class marryCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.FUN,
			description: "Marries you to another user.",
			usage: "<user>",
			aliases: ["spouse"],
			allowdisable: true,
		});
	}

	async run(msg, [mentionorID]) {
		// Checks the marriage index
		const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID);
		if (!member) return;
		if (member.id == msg.author.id) return;
		const marriageStates = await this.db.table("marry").getAll(msg.author.id, member.id, {
			index: "marriageIndex",
		});
		// If info in the DB is found
		if (marriageStates.find(m => m.id === msg.author.id || m.marriedTo === msg.author.id)) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You are already married.",
				}),
			});
			return;
		}
		// If the mentioned user is already married
		if (marriageStates.find(m => m.id === member.id || m.marriedTo === member.id)) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: `${member.username} is already taken.`,
				}),
			});
			return;
		}
		// Asks for confirmation
		await msg.channel.createMessage({
			embed: this.embed({
				title: `${member.username}, do you wish ${msg.author.username} to be your spouse?`,
				description: `Either respond with y or yes if you want to be married or n or no otherwise. You have 10 seconds to reply.`,
			}),
		});
		// Inserts the marriage into the DB
		const resp = await yn(this.bot, { author: member.user, channel: msg.channel });
		if (resp) {
			await this.db.table("marry").insert({
				id: msg.author.id,
				marriedTo: member.id,
			});
			await msg.channel.createMessage({
				embed: this.embed({
					title: "Married!",
					description: `You are married now. Good luck!`,
				}),
			});
		} else {
			// Timeout / n
			await msg.channel.createMessage({
				embed: this.embed({
					title: "Marriage cancelled.",
					description: `Better luck in the future...`,
				}),
			});
		}
	}
}

module.exports = marryCommand;
