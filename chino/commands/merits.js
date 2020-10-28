const Command = require("../lib/Command");
const get = require("snekfetch");
const {
	CommandCategories,
} = require("../lib/Constants");
class meritsCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user>",
			category: CommandCategories.FUN,
			description: "Check how many merits a user has.",
			allowdisable: true,
			aliases: ["rep"],
		});
	}
	// Checks if the author mentioned a valid user.
	async run(msg, [mentionorID]) {
		const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID) || msg.member;
		const merits = await this.db.table("merits").filter({
			receiverId: member.id,
			guildId: msg.guild.id,
		});
		// No merits
		if (!merits.length) {
			await msg.channel.createMessage({
				embed: this.embed({
					title: "No merits.",
					description: `**${member.id === msg.member.id ? "You" : member.username}** do${member.id === msg.member.id ? "n't" : "esn't"} have any merits.`,
				}),
			});
		// Over 25 merits
		} else if (merits.length > 25) {
			const meritString = `Merits for ${this.bot.tag(member)}\r\n========\r\n${merits.map(m => `${m.id} (issued by ${this.bot.tag(msg.guild.members.get(m.giverId) || { username: "Unknown User", discriminator: "0000" })})\r\n${m.reason}\r\n========`).join("\r\n")}`;
			const hastebin = await get.post("https://hastebin.com/documents", { data: meritString });
			await msg.channel.createMessage({
				embed: this.embed({
					title: `Merits`,
					description: `**${member.id === msg.member.id ? "You" : member.username}** ha${member.id === msg.member.id ? "ve" : "s"} more than 25 merits. [Hastebin URL](https://hastebin.com/${hastebin.body.key})`,
					color: 0x41ff70,
				}),
			});
		} else {
			// Posts merits
			await msg.channel.createMessage({
				embed: this.embed({
					title: `${member.username} has ${merits.length} merit(s).`,
					fields: merits.map(m => ({
						name: `${m.id}`,
						value: `${m.reason.slice(0, 150) || "No reason provided"} **(from ${msg.guild.members.get(m.giverId).username || "Unknown User"})**`,
					})),
				}),
			});
		}
	}
}

module.exports = meritsCommand;
