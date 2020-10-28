const Command = require("../lib/Command");
const request = require("snekfetch");
const config = require("../config.json");
const {
	CommandCategories,
} = require("../lib/Constants");

class osuCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<username>",
			category: CommandCategories.FUN,
			description: "Returns osu! information about an account.",
			allowdisable: true,
		});
	}
	async run(msg, args) {
		const formatNumber = num => Number.parseFloat(num).toLocaleString(undefined, { maximumFractionDigits: 2 });
		let errored = 0;
		let osucmd = args.join(" ");
		// Gets the osu! API
		const { body } = await request
			.get("https://osu.ppy.sh/api/get_user")
			.query({
				k: `${config.osuAPI}`,
				u: osucmd,
				type: "string",
			});
		if (!body.length) {
			return msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `Cannot find the player you are looking for!`,
				}),
			});
		}
		const data = body[0];
		msg.channel.createMessage({
			embed: this.embed({
				thumbnail: {
					url: `https://a.ppy.sh/${data.user_id}?ifyouseethisyoureallyneedtogetalife.png`,
				},
				author: {
					name: data.username,
					url: `https://osu.ppy.sh/users/${data.user_id}?ifyouseethisyoureallyneedtogetalife.png`,
				},
				fields: [{
					name: "ID",
					value: data.user_id,
					inline: true,
				},
				{
					name: "PP",
					value: data.pp_raw ? formatNumber(data.pp_raw) : "???",
					inline: true,
				},
				{
					name: "Rank",
					value: data.pp_rank ? formatNumber(data.pp_rank) : "???",
					inline: true,
				},
				{
					name: "Country Rank",
					value: `:flag_${data.country.toLowerCase()}:#${data.pp_country_rank}`,
					inline: true,
				},
				{
					name: "Level",
					value: data.level,
					inline: true,
				},
				{
					name: "Accuracy",
					value: data.accuracy ? `${Math.round(data.accuracy)}%` : "???",
					inline: true,
				},
				{
					name: "Plays",
					value: data.playcount ? formatNumber(data.playcount) : "???",
					inline: true,
				},
				],
			}),
		});
	}
}

module.exports = osuCommand;
