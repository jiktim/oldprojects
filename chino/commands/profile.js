const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class profileCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.GENERAL,
			description: "Views a users profile info.",
			aliases: ["user", "view-user", "userinfo"],
			usage: "<user>",
			allowdisable: true,
		});
	}
	// Better Statuses
	switchStatus(s) {
		if (s == "online") return "Online";
		if (s == "idle") return "Idle";
		if (s == "dnd") return "Do not disturb";
		if (s == "offline") return "Offline/Invisible";
	}
	// Checks for a valid user
	async run(msg, [mentionorID]) {
		const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID) || msg.member;
		const playing = member.game && member.game.name.trim() ? member.game.name.trim() : "Nothing";
		const [marriageState] = await this.db.table("marry").getAll(member.id, { index: "marriageIndex" });
		msg.channel.createMessage({
			embed: this.embed({
				title: this.bot.tag(member),
				thumbnail: {
					url: member.user.dynamicAvatarURL("null", 1024),
				},
				fields: [{
					name: "Created on:",
					value: this.bot.dateFormat(member.createdAt),
					inline: true,
				}, {
					name: "Joined on:",
					value: this.bot.dateFormat(member.joinedAt),
					inline: true,
				}, {
					name: "ID:",
					value: member.id,
					inline: true,
				}, {
					name: "Status:",
					value: this.switchStatus(member.status),
					inline: true,
				}, {
					name: "Highest Role:",
					value: member.roles.length > 0 ? member.roles.map(r => msg.guild.roles.get(r)).sort((a, b) => b.position - a.position)[0].name : "@everyone",
					inline: true,
				}, {
					name: "Playing:",
					value: playing,
					inline: true,
				}, {
					name: "Married to:",
					value: marriageState ? `<@!${marriageState.id === member.id ? marriageState.marriedTo : marriageState.id}>` : "Nobody",
					inline: true,
				}],
			}),
		});
	}
}

module.exports = profileCommand;
