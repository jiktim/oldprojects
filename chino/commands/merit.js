const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
const { snowflake } = require("../lib/Snowflake");
class meritCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user> <message>",
			category: CommandCategories.FUN,
			description: "Gives a merit to a user.",
			requiredPerms: "manageMessages",
			allowdisable: true,
			aliases: ["addrep", "repadd"],
		});
	}
	// Checks if the author mentioned a valid user
	async run(msg, [mentionorID, ...reason]) {
		const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID);
		if (!member) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "User not found.",
				}),
			});
			return;
		}
		// Inserts the merit into the DB with the reason
		let reasonString = reason.join(" ");
		if (reasonString.length > 1000) reasonString = reasonString.slice(0, 1000);
		const id = snowflake();
		await this.db.table("merits").insert({
			giverId: msg.author.id,
			receiverId: member.id,
			guildId: msg.guild.id,
			id,
			reason: reasonString || "No reason provided.",
		});
		// Posts the embed
		this.bot.emit("meritAdd", msg.guild, msg.member, member, id, reasonString || "No reason provided.");
		msg.channel.createMessage({
			embed: this.succembed({
				title: "Success!",
				description: `You've given **${member.username}** a merit!`,
			}),
		});
	}
}

module.exports = meritCommand;
