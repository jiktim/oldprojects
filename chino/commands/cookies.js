const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class cookiesCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.FUN,
			description: "Shows how many cookies a user has.",
			aliases: ["money", "balance"],
		});
	}
	// Checks if the author is a valid author & if the user is a valid user.
	async run(msg, args) {
		let cookies = 0;
		const member = msg.guild.members.find(m => m.id == args[0] || `<@${m.id}>` === args[0] || `<@!${m.id}>` === args[0]);
		if (!member) {
			const cookiesDB = await this.db.table("cookies").get(msg.author.id);
			if (!cookiesDB) cookies = 0;
			else cookies = cookiesDB.amount;
			msg.channel.createMessage({
				embed: this.embed({
					title: `Cookies`,
					description: `You have **${cookies}** cookies! 🍪`,
				}),
			});
		} else {
			// Posts the amount of cookies the mentioned user has.
			const cookiesDB = await this.db.table("cookies").get(member.id);
			if (!cookiesDB) cookies = 0;
			else cookies = cookiesDB.amount;
			msg.channel.createMessage({
				embed: this.embed({
					title: `Cookies`,
					description: `**${member.username}** has **${cookies}** cookies! 🍪`,
				}),
			});
		}
	}
}

module.exports = cookiesCommand;
