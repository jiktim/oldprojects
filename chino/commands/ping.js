const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class pingCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.GENERAL,
			description: "Pings the bot.",
			aliases: ["pig", "pog"],
			allowdisable: false,
		});
	}

	async run(msg, args) {
		const message = await msg.channel.createMessage("Pinging..."),
			{
				timestamp,
			} = message;
		await message.edit({
			content: "",
			embed: this.embed({
				title: "Pong!",
				description: `This message took ${timestamp - msg.timestamp}ms.`,
				footer: {
					text: `Latency: ${msg.guild.shard.latency}ms`,
				},
			}),
		});
	}
}

module.exports = pingCommand;
