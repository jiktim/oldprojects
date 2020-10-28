const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class addAssignable extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<role>",
			category: CommandCategories.MISC,
			description: "Set roles to be assignable in the assign command.",
			aliases: ["addassignablerole", "assignablerole", "addassign"],
			requiredPerms: "manageRoles",
			allowdisable: true,
		});
	}

	async run(msg, args) {
		// Finds the role in Discord to set to be assignable.
		const role = msg.channel.guild.roles.find(a => a.name.toLowerCase().startsWith(args.join(" ").toLowerCase()));
		if (!args[0]) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "Please provide arguments.",
				}),
			});
			return;
		}
		if (!role) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "This role cannot be found.",
				}),
			});
			return;
		}
		// Marks the role to be assignable & puts it in the DB.
		const assign = await this.db.table("assign").filter({
			id: role.id,
		});
		if (assign.length == 0) {
			await this.db.table("assign").insert({
				guildid: msg.channel.guild.id,
				id: role.id,
			});
			this.bot.emit("assignableRoleAdd", msg.guild, msg.member, role);
			msg.channel.createMessage({
				embed: this.succembed({
					title: "Success!",
					description: `${role.name} is now an assignable role.`,
				}),
			});
		} else {
			msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You've already set this role to be assignable.",
				}),
			});
		}
	}
}

module.exports = addAssignable;
