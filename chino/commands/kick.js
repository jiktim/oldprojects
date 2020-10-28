const Command = require("../lib/Command");
const yn = require("../lib/askYesNo.js");
const {
	CommandCategories,
} = require("../lib/Constants");
class kickCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user> <reason>",
			category: CommandCategories.MODERATION,
			description: "Kicks a user from the server.",
			requiredPerms: "kickMembers",
			allowdisable: true,
		});
	}
	// Checks if the author mentioned a valid user
	async run(msg, [mentionorID, ...reason]) {
		if (!msg.channel.guild.members.get(this.bot.user.id).permission.has("kickMembers")) {
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
				embed: this.embed({
					title: "Error!",
					description: "User not found.",
				}),
			});
			return;
		}
		// Logs to the audit log & asks for confirmation
		let finalReason = reason.length > 0 ? reason.join(" ") : "No reason provided";
		if (this.bot.passesRoleHierarchy(msg.member, member)) {
			let usure = await msg.channel.createMessage({
				embed: this.embed({
					title: `Kick`,
					description: `Are you sure you want to kick **${member.username}**?`,
				}),
			});
			// Asks y/n and reacts accordingly
			const resp = await yn(this.bot, { author: msg.author, channel: msg.channel });
			if (!resp) {
				await msg.channel.createMessage({
					embed: this.embed({
						title: `Kick`,
						description: `Cancelled kicking **${member.username}**.`,
					}),
				});
				return;
			}
			// DMs the user about their kick if possible
			const dm = await member.user.getDMChannel();
			let failedToDM = false;
			try {
				await dm.createMessage({
					embed: this.embed({
						title: `You were kicked from ${msg.channel.guild.name} by ${msg.author.username}.`,
						description: `Reason: ${finalReason}`,
					}),
				});
			} catch (_) {
				failedToDM = true;
			}

			try {
				await member.kick(finalReason);
			} catch (_) {
				// console.error(_);
				// Posts if the user couldn't be kicked.
				await msg.channel.createMessage({
					embed: this.errembed({
						title: "Error!",
						description: "I could not kick the user specified.",
					}),
				});
				return;
			}
			// Posts when the member is kicked; also shows if they failed to get the DM.
			this.bot.emit("guildKick", msg.guild, msg.member, member, reason);
			await msg.channel.createMessage({
				embed: this.errembed({
					title: `${msg.author.username} kicked ${member.username}.`,
					description: `Reason: ${finalReason}`,
					fields: failedToDM ? [{
						name: "I have to failed to DM the user about their kick.",
						value: "Either you kicked a bot, or they have DMs disabled.",
					}] : [],
				}),
			});
		} else {
			// If the author doesn't have permission
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					name: "You don't have permission to do this.",
					description: "Either you lack the kickMembers permission or you tried kicking someone with a higher role.",
				}),
			});
		}
	}
}

module.exports = kickCommand;
