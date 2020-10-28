const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
const snek = require("snekfetch");
class urbanCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<word>",
			category: CommandCategories.FUN,
			description: "Gives the definition of a word from the Urban Dictionary.",
			aliases: ["ud", "urbandic", "urbandictionary"],
			allowdisable: true,
		});
	}
	// API & Embed
	async run(msg, args) {
		const arg = encodeURIComponent(args.join(" "));
		const udlist = await snek.get(`http://api.urbandictionary.com/v0/define?term=${arg}`);
		const udword = udlist.body.list[1];
		msg.channel.createMessage({
			embed: this.embed({
				title: udword.word,
				description: `**Definition:** \n ${udword.definition} \n \n **Example:** \n \`${udword.example}\` \n`,
			}),
		});
	}
}

module.exports = urbanCommand;
