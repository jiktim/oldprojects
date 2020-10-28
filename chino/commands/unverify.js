const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class unverifyCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user>",
			category: CommandCategories.MODERATION,
			description: "Removes the verified role from a user.",
			requiredPerms: "manageMessages",
			aliases: ["untrust"],
			allowdisable: true,
		});
	}
	// Looks for user
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
					description: `Your server is not set up properly. Run -setup and try again.`,
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
					description: `Your server is not set up properly. Run -setup and try again.`,
				}),
			});
			return;
		}
		// Doesn't have verified role
		if (!member.roles.includes(guildConfig.verified)) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `**${member.username}** doesn't have the verified role.`,
				}),
			});
		} else {
			// Removes verified role
			try {
				await member.removeRole(guildConfig.verified, `${msg.author.username} unverified`);
				this.bot.emit("memberUnverify", msg.guild, msg.member, member);
				msg.channel.createMessage({
					embed: this.succembed({
						title: `Success!`,
						description: `I removed the verified role from **${member.username}**.`,
					}),
				});
			} catch (e) {
				if (e) {
					// Error
					msg.channel.createMessage({
						embed: this.errembed({
							title: `Error!`,
							description: `**${member.username}** doesn't have the verified role.`,
						}),
					});
				}
			}
		}
	}
}
module.exports = unverifyCommand;
