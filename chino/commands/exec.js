const Command = require("../lib/Command");
const get = require("snekfetch");
const {
	CommandCategories,
} = require("../lib/Constants");
class execCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<what to execute>",
			category: CommandCategories.OWNER,
			description: "Runs a command on the bot's host.",
			aliases: ["shell", "execute"],
			allowdisable: false,
		});
	}
	async run(msg, args) {
		if (args.length == 0) {
			msg.channel.createMessage({
				embed: {
					title: "Error!",
					description: `You must specify what you want to execute.`,
					color: 0xff4242,
					timestamp: new Date(),
				},
			});
			return;
		}
		try {
			require("child_process").exec(args.join(" "), async(error, stdout, stderr) => {
				if (stderr) {
					msg.channel.createMessage({
						embed: {
							title: "Error!",
							description: stderr,
							color: 0xff4242,
							timestamp: new Date(),
						},
					});
					return;
				}
				if (stdout.length > 2048) {
					async function hastebin(data) {
						const hastebin = await get.post("https://hastebin.com/documents", { data: data });
						return hastebin.body.key;
					}
					const hastebinoutput = await hastebin(stdout);
					msg.channel.createMessage({
						embed: {
							title: "Error!",
							description: `Output longer than 2048. [Hastebin URL](https://hastebin.com/${hastebinoutput})`,
							timestamp: new Date(),
							color: 0xffff7a,
						},
					});
				} else {
					msg.channel.createMessage({
						embed: {
							title: "Success!",
							description: `\`\`\`\n${stdout}\n\`\`\``,
							timestamp: new Date(),
							color: 0x41ff70,
						},
					});
				}
			});
		} catch (e) {
			msg.channel.createMessage({
				embed: {
					title: "Error!",
					description: e,
					color: 0xff4242,
					timestamp: new Date(),
				},
			});
		}
	}
}
module.exports = execCommand;
