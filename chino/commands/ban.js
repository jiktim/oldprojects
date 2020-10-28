const Command = require("../lib/Command");
const yn = require("../lib/askYesNo.js");
const {
	CommandCategories,
} = require("../lib/Constants");
class banCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user> <reason>",
			category: CommandCategories.MODERATION,
			description: "Bans a user from the server.",
			aliases: ["banmember", "ban-member"],
			requiredPerms: "kickMembers",
		});
	}
	// Checks if the mentioned user is valid.
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
		// If the user is invalid, error out.
		if (!member) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "User not found.",
				}),
			});
			return;
		}
		// Sets the ban reason.
		let finalReason = reason.length > 0 ? reason.join(" ") : "No reason provided";
		// If the bot is above the member it's attempting to ban, ask y/n.
		if (this.bot.passesRoleHierarchy(msg.member, member)) {
			let usure = await msg.channel.createMessage({
				embed: this.embed({
					title: `Ban`,
					description: `Are you sure you want to ban **${member.username}**?`,
				}),
			});
			// If the author responds with 'y or n', act so accordingly.
			const resp = await yn(this.bot, {
				author: msg.author,
				channel: msg.channel,
			});
			if (!resp) {
				await msg.channel.createMessage({
					embed: this.embed({
						title: `Ban`,
						description: `Cancelled banning **${member.username}**.`,
					}),
				});
				return;
			}
			// DMs the user about their ban if possible.
			// This *still* DMs the user if it failed, not sure why...
			const dm = await member.user.getDMChannel();
			let failedToDM = false;
			try {
				await dm.createMessage({
					embed: this.errembed({
						title: `You were banned from ${msg.channel.guild.name} by ${msg.author.username}.`,
						description: `Reason: ${finalReason}`,
					}),
				});
			} catch (_) {
				failedToDM = true;
			}
			// Logs to to audit logs their ban reason.
			try {
				await member.ban(1, `${finalReason}`);
			} catch (_) {
				await msg.channel.createMessage({
					embed: this.errembed({
						title: `Error!`,
						description: `I could not ban the user specified.`,
					}),
				});
				return;
			}
			// Posts that the member was banned & if it failed to DM the banned user, also post that in chat.
			await msg.channel.createMessage({
				embed: this.errembed({
					title: `${msg.author.username} banned ${member.username}.`,
					description: `Reason: ${finalReason}.`,
					fields: failedToDM ? [{
						name: "I have failed to DM the user about their ban.",
						value: "Either you banned a bot, or they have DMs disabled.",
					}] : [],
				}),
			});
		} else {
			// If the user does not have permission to ban the user
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					name: "You don't have permission to do this.",
					description: "Either you lack the kickMembers permission or you tried banning someone with a higher role.",
				}),
			});
		}
	}
}

module.exports = banCommand;
