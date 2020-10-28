const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class coolCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user>",
			category: CommandCategories.FUN,
			description: "Guesses how cool a user is.",
			aliases: ["coolness"],
			allowdisable: true,
		});
	}

	// Checks to see if the author mentioned another user.
	async run(msg) {
		function cool() {
			if (msg.mentions[0]) {
				var member = msg.mentions[0];
			} else {
				var member = msg.author;
			}
			// Math.random to determine the user's coolness
			if (member.id != "505076860561129482") {
				var random = (Math.random() * 99) + 1;
				if (random >= 40 && random < 70) {
					random = `**${member.username}** is pretty cool! 😄`;
					return random;
				} else if (random >= 70 && random <= 89) {
					random = `**${member.username}** is really cool! 👍`;
					return random;
				} else if (random <= 39 && random > 10) {
					random = `**${member.username}** is lame. 😦`;
					return random;
				} else if (random < 10) {
					random = `**${member.username}** isn't cool at all and never will be. 😭`;
					return random;
				} else if (random >= 90) {
					random = `**${member.username}** is super cool. 😎`;
					return random;
				}
			} else {
				return `**${member.username}** isn't cool at all and never will be. 😭`;
			}
		}
		msg.channel.createMessage({
			embed: this.embed({
				title: "Cool",
				description: cool(),
			}),
		});
	}
}

module.exports = coolCommand;
