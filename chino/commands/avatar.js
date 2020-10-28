const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class avatarCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user>",
			category: CommandCategories.GENERAL,
			description: "Shows a user's profile picture.",
			aliases: ["pfp", "profilepic", "profilepicture"],
			allowdisable: true,
		});
	}
	// Gets the mentioned user's ID, else show the author's avatar.
	async run(msg, [mentionorID]) {
		const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID) || msg.member;
		await msg.channel.createMessage({
			embed: this.embed({
				title: this.bot.tag(member),
				image: {
					url: member.user.dynamicAvatarURL(null, 1024),
				},
			}),
		});
	}
}

module.exports = avatarCommand;
