const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class muteCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user>",
			category: CommandCategories.MODERATION,
			description: "Mutes a user.",
			requiredPerms: "manageMessages",
			allowdisable: true,
		});
	}
	// If the user is invalid
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
		// If the guildConfig is messed up / unsetup / role can't be found
		if (!guildConfig) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `Your server is not set up properly. Run -setup and try again.`,
				}),
			});
			return;
		}

		// If the role is messed up in guildCOnfig
		let role = await msg.channel.guild.roles.find(role => role.id == guildConfig.muted);

		if (!role) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `Your server is not set up properly. Run -setup and try again.`,
				}),
			});
			return;
		}
		// If the member already has the muted role
		if (member.roles.includes(role.id)) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `**${member.username}** is already muted.`,
				}),
			});
			// Inserts the muted user & their previous roles into the muteCache
		} else if (this.bot.passesRoleHierarchy(msg.member, member)) {
			await member.roles.forEach(async rolez => {
				await this.db.table("muteCache").insert({
					role: rolez,
					member: member.id,
					guild: msg.channel.guild.id,
				});
				// console.log(typeof rolez);
				try {
					// Tries to remove their previous roles
					await msg.channel.guild.removeMemberRole(member.id, rolez, `Mute ran by ${msg.author.username}#${msg.author.discriminator}`);
				} catch (e) {
					console.log(e);
				}
			});
			// Adds the muted role to the user & audit logs it
			await member.addRole(guildConfig.muted, `${msg.author.username} muted`);
			this.bot.emit("memberMute", msg.guild, msg.member, member);
			msg.channel.createMessage({
				embed: this.succembed({
					title: `Success!`,
					description: `**${member.username}** was muted.`,
				}),
			});
		} else {
			msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					name: "You don't have permission to do this.",
					description: "Either you lack the manageMessages permission or you tried muting someone with a higher role.",
				}),
			});
		}
	}
}

module.exports = muteCommand;
