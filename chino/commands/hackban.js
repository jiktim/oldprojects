const Command = require("../lib/Command");
const yn = require("../lib/askYesNo.js");
const {
	get,
} = require("snekfetch");
const {
	CommandCategories,
} = require("../lib/Constants");
class hackbanCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<userids>",
			category: CommandCategories.MODERATION,
			description: "Bans a user outside the server.",
			aliases: ["banid", "idban"],
			requiredPerms: "kickMembers",
			allowdisable: true,
		});
	}
	async run(msg, args) {
		if (args.length === 0) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `You must provide some userID(s) for me to hackban.`,
				}),
			});
			return;
		}
		// Asks the author if they're sure they want to do this
		let usure = await msg.channel.createMessage({
			embed: this.embed({
				title: `Hackban`,
				description: `Are you sure you want to hackban **${args.join(", ")}**?`,
			}),
		});

		// Checks for their response and reacts accordingly
		const resp = await yn(this.bot, {
			author: msg.author,
			channel: msg.channel,
		});
		// If no response is given (or no) is given, cancel.
		if (!resp) {
			await msg.channel.createMessage({
				embed: this.embed({
					title: `Hackban`,
					description: `Cancelled hackbanning **${args.join(", ")}**.`,
				}),
			});
			return {
				banned: false,
				user,
			};
		}
		// Attempts to ban the IDs given & log them.
		const bans = await Promise.all(args.map(async user => {
			const m = msg.guild.members.find(m => m.id === user);
			if (m) {
				if (!this.bot.passesRoleHierarchy(msg.member, m)) {
					return {
						banned: false,
						user,
					};
				}
				try {
					await m.ban(0, `Hackbanned by ${msg.author.username}`);
					return {
						banned: true,
						user,
					};
				} catch (_) {
					return {
						banned: false,
						user,
					};
				}
			}
			try {
				await msg.guild.banMember(user, 0, `Hackbanned by ${msg.author.username}`);
				return {
					banned: true,
					user,
				};
			} catch (_) {
				return {
					banned: false,
					user,
				};
			}
		}));
		// If no IDs could be found / unbanned
		const trueBans = bans.filter(b => b.banned);
		const falseBans = bans.filter(b => !b.banned);
		if (!trueBans.length) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `I wasn't able to ban any user(s) you have provided.`,
				}),
			});
		} else {
			// Posts the userIDs that were hackbanned & if some failed also post that.
			await msg.channel.createMessage({
				embed: this.embed({
					title: `I hackbanned ${trueBans.length} user${trueBans.length > 1 ? "s" : ""}.`,
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

module.exports = hackbanCommand;
