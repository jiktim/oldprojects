const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class payCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user> <amount>",
			category: CommandCategories.FUN,
			description: "Gives a user some of your cookies.",
			aliases: ["givemoney", "transfer", "givecookies"],
		});
	}
	async run(msg, args) {
		// Checks if the mentioned user is valid
		const mentionorID = args[0];
		const amount = parseInt(args[1]);
		const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID);
		if (!member) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You need to mention a user you want to give cookies to.",
				}),
			});
			return;
		}
		// Checks if the mentioned user = author
		if (member.id === msg.author.id) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You can't pay yourself.",
				}),
			});
			return;
		}
		// Checks for a valid amount
		if (!amount) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You need to enter a valid amount.",
				}),
			});
			return;
		}
		if (isNaN(amount)) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You need to enter a valid amount.",
				}),
			});
			return;
		}
		// DB
		let mcookies = await this.db.table("cookies").get(member.id);
		let ucookies = await this.db.table("cookies").get(msg.author.id);

		if (!mcookies) {
			await this.db.table("cookies").insert({
				id: member.id,
				amount: 0,
				lastclaim: 9999,
			});
			mcookies = await this.db.table("cookies").get(member.id);
			return;
		}
		if (!ucookies) {
			await this.db.table("cookies").insert({
				id: msg.author.id,
				amount: 0,
				lastclaim: 9999,
			});
			mcookies = await this.db.table("cookies").get(msg.author.id);
			return;
		}
		// Checks if they have enough cookies
		if (amount > ucookies.amount || amount < 0) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You don't have enough cookies to do this!",
				}),
			});
			return;
		}
		ucookies.amount -= amount;
		mcookies.amount += amount;
		// Inserts cookies into DB
		await this.db.table("cookies").get(member.id).update(mcookies);
		await this.db.table("cookies").get(msg.author.id).update(ucookies);
		msg.channel.createMessage({
			embed: this.embed({
				title: "Success!",
				description: `You gave **${amount}** cookie(s) to **${member.username}**.`,
			}),
		});
	}
}

module.exports = payCommand;
