const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class voteCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.GENERAL,
			description: "Gives you a link to vote for the bot.",
			allowdisable: false,
		});
	}
	// Sends the embed.
	async run(msg) {
		await msg.channel.createMessage({
			embed: this.embed({
				title: "Vote",
				description: `You can vote for me on DBL [here](https://discordbots.org/bot/493904957523623936/vote).`,
			}),
		});
	}
}

module.exports = voteCommand;
