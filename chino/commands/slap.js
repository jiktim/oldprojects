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
class slapCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user>",
			category: CommandCategories.FUN,
			description: "Slaps a user.",
			allowdisable: true,
		});
	}
	async run(msg, args) {
		var mentionorID = args[0];
		let user = "themselves";
		const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID);
		if (member) user = member.username;
		// Gets the slap tag from weebSH
		weebSH.images.getRandomImage("slap")
			.then(image => msg.channel.createMessage({
				embed: {
					color: 0x7289DA,
					title: `${msg.author.username} slapped ${user}!`,
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

module.exports = slapCommand;
