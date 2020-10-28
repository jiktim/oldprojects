const Command = require("../lib/Command");
const {
	get,
} = require("snekfetch");
const {
	CommandCategories,
} = require("../lib/Constants");
class unbanCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<userids>",
			category: CommandCategories.MODERATION,
			description: "Unbans a user outside the server.",
			aliases: ["unbanid", "pardon"],
			requiredPerms: "kickMembers",
			allowdisable: true,
		});
	}
	async run(msg, args) {
		if (args.length === 0) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `You must provide some userID(s) for me to unban.`,
				}),
			});
			return;
		}
		if (!msg.channel.guild.members.get(this.bot.user.id).permission.has("banMembers")) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "I lack the banMembers permission.",
				}),
			});
			return;
		}
		// Checks if it's valid
		const bans = await Promise.all(args.map(async user => {
			const m = msg.guild.members.find(m => m.id === user);

			try {
				await msg.guild.unbanMember(user, 0, `unbanned by ${msg.author.username}`);
				return { banned: true, user };
			} catch (_) {
				return { banned: false, user };
			}
		}));
		const trueBans = bans.filter(b => b.banned);
		const falseBans = bans.filter(b => !b.banned);
		if (!trueBans.length) {
			// Error
			await msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `I wasn't able to unban any user(s) you have provided.`,
				}),
			});
		} else {
			// Embed
			await msg.channel.createMessage({
				embed: this.embed({
					title: `${trueBans.length}user(s) have been unbanned.`,
					description: `${trueBans.map(m => m.user).join(", ")}`,
					fields: falseBans.length ? [{
						name: `I could not unban one or more user(s).`,
						value: `Here are their ID(s): ${falseBans.map(m => m.user).join(", ")}`,
					}] : [],
				}),
			});
		}
	}
}

module.exports = unbanCommand;
