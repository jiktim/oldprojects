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
class cuddleCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user>",
			category: CommandCategories.FUN,
			description: "Cuddles a user.",
			allowdisable: true,
		});
	}
	async run(msg, args) {
		var mentionorID = args[0];
		// Checks to see if the user has mentioned themselves / nobody.
		let user = "themselves";
		// Checks to see if the mentioned member is valid.
		const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID);
		if (member) user = member.username;
		// Gets the tag from weebSH and posts it.
		weebSH.images.getRandomImage("cuddle")
			.then(image => msg.channel.createMessage({
				embed: {
					color: 0x7289DA,
					title: `${msg.author.username} cuddled ${user}!`,
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

module.exports = cuddleCommand;
