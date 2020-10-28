const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class verifyCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user>",
			category: CommandCategories.MODERATION,
			description: "Gives a user the verified role.",
			requiredPerms: "manageMessages",
			aliases: ["trust", "approve"],
			allowdisable: true,
		});
	}
	async run(msg, args) {
		if (!msg.channel.guild.members.get(this.bot.user.id).permission.has("manageRoles")) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "I don't have permission to do this.",
				}),
			});
			return;
		}
		// Looks for a valid user.
		const member = msg.guild.members.find(m => m.id == args[0] || `<@${m.id}>` === args[0] || `<@!${m.id}>` === args[0]);
		let guildConfig = msg.guildConfig;
		if (!member) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `User not found.`,
				}),
			});
			return;
		}
		// Error during setup
		if (!guildConfig) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `Your server is not set up properly. Run \`-setup\` and try again.`,
				}),
			});
			return;
		}

		let role = await msg.channel.guild.roles.find(role => role.id == guildConfig.verified);

		// Error during setup
		if (!role) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `Your server is not set up properly. Run \`-setup\` and try again.`,
				}),
			});
			return;
		}
		// If the user already has the verified role
		if (member.roles.includes(guildConfig)) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `**${member.username}** already has the verified role.`,
				}),
			});
		} else {
			// Gives the user the verified role & sends an embed
			await member.addRole(guildConfig.verified, `${msg.author.username} verified ${member.username}`);
			this.bot.emit("memberVerify", msg.guild, msg.member, member);
			msg.channel.createMessage({
				embed: this.succembed({
					title: `Success!`,
					description: `I gave the verified role to **${member.username}**.`,
				}),
			});
		}
	}
}

module.exports = verifyCommand;
