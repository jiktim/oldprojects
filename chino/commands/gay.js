const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class gayCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<user>",
			category: CommandCategories.FUN,
			description: "Calculates how gay a user is.",
			aliases: ["gayness", "calculategay"],
			allowdisable: true,
		});
	}

	async run(msg, [mentionorID]) {
		// Finds the user, if valid mention it, else use the author's ID.
		const member = msg.guild.members.find(m => m.id == mentionorID || `<@${m.id}>` === mentionorID || `<@!${m.id}>` === mentionorID) || msg.member;
		const random = Math.floor(Math.random() * 99) + 1;
		const emoji = random > 50 ? "🏳️‍🌈" : "😄";
		// String that is posted
		let string = `**${member.username}** is **${random}%** gay! ${emoji}`;
		// TTtie's awful gayness string
		if (member.id === "150628341316059136") {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "TTtie has taken the official gay test made by the Chino Development Team and we deemed that he isn't gay.\nTherefore, a TTtie cannot be gay.",
				}),
			});
			return;
		// Special gayness modifiers
		} else if (member.id === "511324138388848664") {
			string = `**${member.username}** is 10000000000% gay! 🏳️‍🌈`;
		} else if (member.id === "229373852939976709") {
			string = `**${member.username}** is a **pure loli**. Stop lewding her.`;
		} else if (member.id === "270046964115046400") {
			string = `**${member.username}** is ${process.env.ISBAIJIGAY !== "true" ? "0%" : "100%"} gay. ${process.env.ISBAIJIGAY !== "true" ? "Dolphins can't be gay... hopefully." : "The one who edited this found a research about the gayness of dolphins; therefore, **dolphins must be gay**."} :dolphin:`;
		} else if (member.id === "478512959598100501" || member.id === "357583052525928449") {
			string = `**${member.username}** is 100000000000% gay! 🌈`;
		} else if (member.id === this.bot.user.id) {
			string = `**${member.username}** is a **robot** that does not understand the concept of love.`;
		} else if (member.id === "284432595905675264") {
			string = `**${member.username}** surrendered while taking the test. 🏳 `;
		} else if (member.id === "237503303519436801") {
			string = `**${member.username}** is a **pure shota**. Shotas aren't gay.`;
		} else if (member.id === "422398012418162688") {
			string = `**${member.username}** is **101%** gay, completely off the charts. 🏳️‍🌈`;
		}

		// Embed
		msg.channel.createMessage({
			embed: this.embed({
				title: "Gay",
				description: string,
			}),
		});
	}
}

module.exports = gayCommand;
