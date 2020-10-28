const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class ballCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<text>",
			category: CommandCategories.FUN,
			description: "Asks the 8ball a question.",
			aliases: ["eightball", "8b"],
			allowdisable: true,
		});
	}

	async run(msg) {
		// Sets the responses for 8ball to return.
		let responses = ["It is certain.", "it is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
		await msg.channel.createMessage({
			embed: this.embed({
				title: "8ball",
				description: `${responses[Math.floor(Math.random() * responses.length)]}`,
			}),
		});
	}
}

module.exports = ballCommand;
