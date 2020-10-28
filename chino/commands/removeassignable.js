const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class removeassignableCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<role>",
			category: CommandCategories.MISC,
			description: "Remove roles from the assign command.",
			requiredPerms: "manageRoles",
			aliases: ["removeassignablerole", "rmassignable"],
			allowdisable: true,
		});
	}
	// Checks if the role can be found
	async run(msg, args) {
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
		// DB
		const assign = await this.db.table("assign").filter({
			id: role.id,
		});
		if (assign.length != 0) {
			await this.db.table("assign").filter({
				guildid: msg.channel.guild.id,
				id: role.id,
			}).delete();
			this.bot.emit("assignableRoleRemove", msg.guild, msg.member, role);
			msg.channel.createMessage({
				embed: this.succembed({
					title: "Success!",
					description: `${role.name} is no longer an assignable role.`,
				}),
			});
		} else {
			// If role can't be found
			msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "This role cannot be found.",
				}),
			});
		}
	}
}

module.exports = removeassignableCommand;
