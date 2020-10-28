const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
const { snowflake } = require("../lib/Snowflake");
class StrikeCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user> <reason>",
			category: CommandCategories.MODERATION,
			description: "Gives a user a strike.",
			requiredPerms: "kickMembers",
			aliases: ["warn", "punish"],
			allowdisable: true,
		});
	}
	// Checks for a valid user
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
		// DB
		let reasonString = reason.join(" ");
		if (reasonString.length > 1000) reasonString = reasonString.slice(0, 1000);
		const id = snowflake();
		await this.db.table("strikes").insert({
			giverId: msg.author.id,
			receiverId: member.id,
			guildId: msg.guild.id,
			id,
			reason: reasonString || "No reason provided.",
		});
		// Embed
		this.bot.emit("strikeAdd", msg.guild, msg.member, member, id, reasonString || "No reason provided.");
		msg.channel.createMessage({
			embed: this.embed({
				title: "Success!",
				description: `You've given **${member.username}** a strike.`,
			}),
		});
	}
}

module.exports = StrikeCommand;
