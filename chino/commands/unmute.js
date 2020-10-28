const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class unmuteCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user>",
			category: CommandCategories.MODERATION,
			description: "Unmutes a user.",
			requiredPerms: "manageMessages",
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

		let role = await msg.channel.guild.roles.find(role => role.id == guildConfig.muted);

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
		// If they don't have the role
		let userroles = await member.roles;
		if (userroles.includes(guildConfig.muted) == false) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `**${member.username}** is not muted!`,
				}),
			});
		} else {
		// Removes the entry from mutecache
			try {
				let cache = await this.db.table("muteCache").filter({
					member: member.id,
					guild: msg.channel.guild.id,
				});
				cache.forEach(async rolez => {
					// console.log(rolez.role);
					await msg.channel.guild.addMemberRole(member.id, rolez.role, `Unmute ran by`);
				});
				await member.removeRole(guildConfig.muted, `${msg.author.username} unmuted`);
				this.bot.emit("memberUnmute", msg.guild, msg.member, member);
				msg.channel.createMessage({
					embed: this.succembed({
						title: `Success!`,
						description: `**${member.username}** was unmuted.`,
					}),
				});
				await this.db.table("muteCache").filter({ member: member.id }).delete();
			} catch (e) {
				if (e) {
					console.log(e);
					msg.channel.createMessage({
						embed: this.errembed({
							title: `Error!`,
							description: `**${member.username}** is not muted!`,
						}),
					});
				}
			}
		}
	}
}

module.exports = unmuteCommand;
