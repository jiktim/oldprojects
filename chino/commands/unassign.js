const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class unassignRole extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<role>",
			category: CommandCategories.MISC,
			description: "Removes an assigned role from yourself.",
			aliases: ["removerole", "unassignrole", "iamnot"],
			allowdisable: true,
		});
	}
	// Checks for the role
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
		if (args.length === 0) {
			const assignableRoles = (await this.db.table("assign").filter({
				guildid: msg.guild.id,
			})).map(r => {
				if (!msg.guild.roles.has(r.id)) return `\`Unknown role (${r.id})\``;
				else return `\`${msg.guild.roles.get(r.id).name}\``;
			});
			msg.channel.createMessage({
				embed: this.embed({
					title: `Unassign Roles`,
					description: `Check the assignable roles using -assign and then type -unassign role.`,
				}),
			});
		// If role can't be found
		} else {
			const role = msg.channel.guild.roles.find(a => a.name.toLowerCase().startsWith(args.join(" ").toLowerCase()));
			if (!role) {
				await msg.channel.createMessage({
					embed: this.errembed({
						title: "Error!",
						description: "This role cannot be found.",
					}),
				});
				return;
			}
			// Assignable role checker
			const assignable = await this.db.table("assign").get(role.id);
			if (!assignable) {
				await msg.channel.createMessage({
					embed: this.errembed({
						title: "Error!",
						description: "This role is not an assignable role.",
					}),
				});
				return;
			}
			if (assignable.guildid !== msg.guild.id) {
				await msg.channel.createMessage({
					embed: this.errembed({
						title: "Error!",
						description: "This role is not an assignable role.",
					}),
				});
				return;
			}
			try {
				await msg.member.removeRole(assignable.id, `Self-assigned role`);
			} catch (e) {
				await msg.channel.createMessage({
					embed: this.errembed({
						title: "Error.",
						description: "I could not remove the role you specified.",
					}),
				});
				return;
			}
			await msg.channel.createMessage({
				embed: this.succembed({
					title: `Success!`,
					description: `You have removed \`${role.name}\` from yourself.`,
				}),
			});
		}
	}
}

module.exports = unassignRole;
