const {
	get,
} = require("snekfetch");
const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class lewdnekoCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.NSFW,
			description: "Posts a lewd image of a neko.",
			allowdisable: true,
			aliases: ["lewdcatgirl"],
		});
	}

	async run(msg) {
		const {
			body: {
				neko,
			},
		// Gets the API
		} = await get("https://nekos.life/api/lewd/neko");
		await msg.channel.createMessage({
			embed: {
				color: 0x7289DA,
				image: {
					url: neko,
				},
			},
		});
	}
}

module.exports = lewdnekoCommand;
