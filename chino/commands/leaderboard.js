const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class leaderboardCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.FUN,
			description: "Shows the users with the most cookies.",
			aliases: ["topmoney", "topcookies"],
		});
	}
	async run(msg, args) {
		// Reads the DB
		const cookies = await this.db.table("cookies");
		var leaderboardcookies = [];
		Object.values(cookies).forEach(cookie => {
			leaderboardcookies.push([cookie.amount, cookie.id]);
		});
		leaderboardcookies.sort((a, b) => b[0] - a[0]);
		var msgContent = "";
		var place = 1;
		leaderboardcookies.forEach(leaderboard => {
			// Top 15 users
			if (place > 15) return;
			// Finds the top 15 users
			var user = this.bot.users.find(o => o.id == leaderboard[1]);
			if (!user) return;
			msgContent = `${msgContent}\n**${place})** ${user.username}#${user.discriminator} **(${leaderboard[0]})**`;
			place += 1;
		});
		msg.channel.createMessage({
			embed: this.embed({
				title: "Cookie Leaderboard",
				description: msgContent,
			}),
		});
	}
}

module.exports = leaderboardCommand;
