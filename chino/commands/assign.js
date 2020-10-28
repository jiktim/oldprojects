const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class assignRole extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<role>",
			category: CommandCategories.MISC,
			description: "Gives yourself a role that has been set to be assigned.",
			aliases: ["addrole", "assignrole", "iam"],
			allowdisable: true,
		});
	}

	// Checks the DB if the role is set to assign, else error out.
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
					title: `Assignable Roles:`,
					description: assignableRoles.join(", ") || "No assignable roles are added.",
				}),
			});
		} else {
			// Checks if the role the user typed is a valid role.
			const role = msg.channel.guild.roles.find(a => a.name.toLowerCase().startsWith(args.join(" ").toLowerCase()));
			if (!role) {
				await msg.channel.createMessage({
					embed: this.errembed({
						title: "Error!",
						description: "That role cannot be found.",
					}),
				});
				return;
			}
			// Errors out if the role is not assignable.
			const assignable = await this.db.table("assign").get(role.id);
			if (!assignable) {
				await msg.channel.createMessage({
					embed: this.errembed({
						title: "Error!",
						description: "That role is not assignable.",
					}),
				});
				return;
			}
			if (assignable.guildid !== msg.guild.id) {
				await msg.channel.createMessage({
					embed: this.errembed({
						title: "Error!",
						description: "That role is not assignable.",
					}),
				});
				return;
			}
			// Tries to give the user the role they requested, else error out if they do not have permission.
			try {
				await msg.member.addRole(assignable.id, `Self-assigned role`);
			} catch (e) {
				await msg.channel.createMessage({
					embed: this.errembed({
						title: "Error!",
						description: "I could not give you the role you specified.",
					}),
				});
				return;
			}
			// If the role is assigned successfully
			await msg.channel.createMessage({
				embed: this.succembed({
					title: `Success!`,
					description: `You have assigned the \`${role.name}\` role to yourself.`,
				}),
			});
		}
	}
}

module.exports = assignRole;
