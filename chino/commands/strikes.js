const Command = require("../lib/Command");
const get = require("snekfetch");
const {
	CommandCategories,
} = require("../lib/Constants");
class strikesCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user>",
			category: CommandCategories.MODERATION,
			description: "Check how many strikes a user has.",
			aliases: ["warnings", "punishinfo", "punishments"],
			allowdisable: true,
		});
	}
	// Looks for strikes in the DB
	async run(msg, [mentionorID]) {
		const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID) || msg.member;
		const strikes = await this.db.table("strikes").filter({
			receiverId: member.id,
			guildId: msg.guild.id,
		});
		// No strikes
		if (!strikes.length) {
			await msg.channel.createMessage({
				embed: this.embed({
					title: "No strikes.",
					description: `**${member.id === msg.member.id ? "You" : member.username}** do${member.id === msg.member.id ? "n't" : "esn't"} have any strikes.`,
				}),
			});
		// Over 25 strikes
		} else if (strikes.length > 25) {
			const strikeString = `strikes for ${this.bot.tag(member)}\r\n========\r\n${strikes.map(m => `${m.id} (issued by ${this.bot.tag(msg.guild.members.get(m.giverId) || { username: "Unknown User", discriminator: "0000" })})\r\n${m.reason}\r\n========`).join("\r\n")}`;
			const hastebin = await get.post("https://hastebin.com/documents", { data: strikeString });
			await msg.channel.createMessage({
				embed: this.embed({
					title: `strikes`,
					description: `**${member.id === msg.member.id ? "You" : member.username}** ha${member.id === msg.member.id ? "ve" : "s"} more than 25 strikes. [Hastebin URL](https://hastebin.com/${hastebin.body.key})`,
					color: 0x41ff70,
				}),
			});
		} else {
			// Embed
			await msg.channel.createMessage({
				embed: this.embed({
					title: `${member.username} has ${strikes.length} strike(s).`,
					fields: strikes.map(m => ({
						name: `${m.id}`,
						value: `${m.reason.slice(0, 150) || "No reason provided"} **(from ${msg.guild.members.get(m.giverId).username || "Unknown User"})**`,
					})),
				}),
			});
		}
	}
}

module.exports = strikesCommand;
