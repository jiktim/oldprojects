const Command = require("../lib/Command");
const yn = require("../lib/askYesNo.js");
const {
	CommandCategories,
} = require("../lib/Constants");
class softbanCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user> <reason>",
			category: CommandCategories.MODERATION,
			description: "Bans a user without deleting their messages.",
			requiredPerms: "kickMembers",
			allowdisable: true,
		});
	}
	// Looks for a valid user
	async run(msg, [mentionorID, ...reason]) {
		if (!msg.channel.guild.members.get(this.bot.user.id).permission.has("banMembers")) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "I don't have permission to do this.",
				}),
			});
			return;
		}
		const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID);
		if (!member) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "User not found.",
				}),
			});
			return;
		}

		let finalReason = reason.length > 0 ? reason.join(" ") : "No reason provided";
		if (msg.member.permission.has("banMembers") && this.bot.passesRoleHierarchy(msg.member, member)) {
			// Confirmation
			let usure = await msg.channel.createMessage({
				embed: this.embed({
					title: `Softban`,
					description: `Are you sure you want to softban **${member.username}**?`,
				}),
			});
			// YN, cancel
			const resp = await yn(this.bot, { author: msg.author, channel: msg.channel });
			if (!resp) {
				await msg.channel.createMessage({
					embed: this.embed({
						title: `Softban`,
						description: `Cancelled softbanning **${member.username}**.`,
					}),
				});
				return;
			}
			// Tries to DM the user about their ban
			const dm = await member.user.getDMChannel();
			let failedToDM = false;
			try {
				await dm.createMessage({
					embed: this.embed({
						title: `You were softbanned from ${msg.channel.guild.name} by ${msg.author.username}.`,
						description: `Reason: ${finalReason}`,
					}),
				});
			} catch (_) {
				failedToDM = true;
			}
			// Bans & logs, else fails
			try {
				await member.ban(0, `${finalReason}`);
			} catch (_) {
				await msg.channel.createMessage({
					embed: this.errembed({
						title: "Error!",
						description: "I could not softban the user specified.",
					}),
				});
				return;
			}
			// Posts about the softban & error if needed to
			await msg.channel.createMessage({
				embed: this.errembed({
					title: `${msg.author.username} softbanned ${member.username}`,
					description: `Reason: ${finalReason}.`,
					fields: failedToDM ? [{
						title: "Error!",
						name: "I have to failed to DM the user about their softban.",
						value: "Either you softbanned a bot, or they have DMs disabled.",
					}] : [],
				}),
			});
		} else {
			// Permissions
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					name: "You don't have permission to do this.",
					description: "Either you lack the kickMembers permission or you tried softbanning someone with a higher role.",
				}),
			});
		}
	}
}

module.exports = softbanCommand;
