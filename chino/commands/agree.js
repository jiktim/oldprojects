const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class agreeCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "",
			category: CommandCategories.MISC,
			description: "Gives a user the member role.",
		});
	}
	async run(msg, args) {
		// Finds the agreement channel from guildConfig.
		const agreeChannel = await msg.channel.guild.channels.find(o => o.id === msg.guildConfig.agreeChannel);
		if (!agreeChannel) return;
		// Gives rhe user the member role from guildConfig.
		if (msg.channel.id === agreeChannel.id) {
			const agreeRole = await msg.channel.guild.roles.find(o => o.id == msg.guildConfig.agreeRole);
			if (!agreeRole) return;
			const memberRole = await msg.member.roles.find(o => o == agreeRole.id);
			if (memberRole) return;
			msg.delete();
			msg.member.addRole(agreeRole.id, "Ran the agree command.");
		}
	}
}

module.exports = agreeCommand;
