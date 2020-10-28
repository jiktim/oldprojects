const Command = require("../lib/Command");
const {
	CommandCategories,
	DiscordEpoch,
} = require("../lib/Constants");
const [major] = process.versions.node.split(".");

class nukeCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<amount> <user>",
			category: CommandCategories.MODERATION,
			description: "Bulk delete messages.",
			requiredPerms: "manageMessages",
			aliases: ["purge", "delete", "purgeall"],
			allowdisable: true,
		});
	}

	getOldestPossibleSnowflake() {
		if (major >= 10) {
			return (BigInt(Date.now()) - BigInt(DiscordEpoch)) << BigInt(22);
		} else {
			return (Date.now() - DiscordEpoch) * 4194304;
		}
	}

	compareSnowflake(num1, num2) {
		if (major >= 10) {
			return BigInt(num1) > BigInt(num2);
		} else {
			return num1 > num2;
		}
	}

	async deleteStrategy(msg, messages) {
		if (messages.length === 0) {
			throw new Error("No messages to delete");
		} else if (messages.length === 1) {
			return msg.channel.deleteMessage(messages[0]);
		} else if (messages.length > 1 && messages.length <= 100) {
			return msg.channel.deleteMessages(messages);
		} else {
			const messageCopy = [...messages];
			const delet = async() => {
				if (messageCopy.length >= 100) {
					const toDelet = messageCopy.splice(0, 100);
					await msg.channel.deleteMessages(toDelet);
					await new Promise(rs => setTimeout(() => rs(), 500));
					return delet();
				} else {
					await msg.channel.deleteMessages(messageCopy);
					return true;
				}
			};

			return delet();
		}
	}
	// Checks for valid user & #
	async run(msg, [messageCount, userToDelete]) {
		if (isNaN(messageCount) || messageCount == 0) return;
		const member = msg.guild.members.find(m => m.id == userToDelete || `<@${m.id}>` === userToDelete || `<@!${m.id}>` === userToDelete);
		if (messageCount < 1) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You can't delete less than one message.",
				}),
			});
			return;
		}
		// Checks if it's over 200 messages.
		if (messageCount > 200) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You can't delete more than 200 messages.",
				}),
			});
			return;
		}
		// Posts embed & deletes it a few seconds after
		await msg.delete(`Nuke command ran by: ${msg.author.username}`);
		const messages = await msg.channel.getMessages(parseInt(messageCount));
		const toDelet = messages.filter(m => {
			if (!member) return true;
			else if (member && m.author.id === member.id) return true;
		}).map(m => m.id);
		try {
			await this.deleteStrategy(msg, toDelet.filter(m => !this.compareSnowflake(m, this.getOldestPossibleSnowflake())));
		} catch (_) {
			// console.error(_);
			// Posts the error embed
			msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					name: "I couldn't delete some messages.",
					description: "It is possible that I lack the manageMessages permission or some of the messages are older than 14 days.",
				}),
			});
			return;
		}
		const nukeMsg = await msg.channel.createMessage({
			embed: this.embed({
				title: "Nuke",
				description: `**${msg.author.username}** deleted **${messages.length}** messages.`,
			}),
		});
		setTimeout(() => { nukeMsg.delete(); }, 4000);
	}
}

module.exports = nukeCommand;
