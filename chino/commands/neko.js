const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
const {
	weebSHToken,
	version,
} = require("../config.json");
const Taihou = require("taihou");
let weebSH = new Taihou(weebSHToken, true, {
	userAgent: `Chino/${version}`,
});
class nekoCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.FUN,
			description: "Posts an image of a neko.",
			aliases: ["catgirl"],
			allowdisable: true,
		});
	}
	async run(msg, args) {
		// Gets the neko tag from weebSH
		weebSH.images.getRandomImage("neko")
			.then(image => msg.channel.createMessage({
				embed: {
					color: 0x7289DA,
					image: {
						url: image.url,
					},
					footer: {
						text: "Powered by weeb.sh",
					},
				},
			}));
	}
}

module.exports = nekoCommand;
