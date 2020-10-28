const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class InviteCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.GENERAL,
			description: "Gives you a link to invite the bot.",
			allowdisable: false,
		});
	}
	// Embed
	async run(msg) {
		await msg.channel.createMessage({
			embed: this.embed({
				title: "Invite",
				description: `You can invite Chino using [this link](https://discordapp.com/oauth2/authorize?&client_id=493904957523623936&scope=bot&permissions=372632774).`,
			}),
		});
	}
}

module.exports = InviteCommand;
