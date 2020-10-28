const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
const {
	inspect,
} = require("util");
class evalCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<js>",
			category: CommandCategories.OWNER,
			description: "Evaluates some JS.",
			allowDisable: false,
		});
	}
	async run(msg, args) {
		try {
			const evaluated = await eval(`(async () => {\n${args.join(" ")}\n})()`);
			const evalstring = typeof evaluated === "string" ? evaluated : inspect(evaluated);
			console.log(evalstring);
			if (evalstring.length > 2033) {
				const hastebin = await this.bot.hastebin(evalstring);
				msg.channel.createMessage({
					embed: {
						title: "Error!",
						description: `Output longer than 2048. [Hastebin URL](https://hastebin.com/${hastebin})`,
						color: 0xff4242,
						timestamp: new Date(),
					},
				});
			} else {
				msg.channel.createMessage({
					embed: {
						title: "Success!",
						description: `Output:\n\`\`\`js\n${evalstring.replace(this.bot.token, "token hahalol")}\n\`\`\``,
						color: 0x41ff70,
						timestamp: new Date(),
					},
				});
			}
		} catch (err) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: `\`\`\`js\n${err.stack}\n\`\`\``,
					color: 0xff4242,
					timestamp: new Date(),
				}),
			});
		}
	}
}

module.exports = evalCommand;
