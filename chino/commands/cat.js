const Command = require("../lib/Command");
const {
	get,
} = require("snekfetch");
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
class catCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.FUN,
			description: "Gives you an image of a cat.",
			aliases: ["meow", "kitten"],
			allowdisable: true,
		});
	}
	async run(msg, args) {
		// Gets the cat tag from weebSH.
		weebSH.images.getRandomImage("animal_cat")
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

module.exports = catCommand;
