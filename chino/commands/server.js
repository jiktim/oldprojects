const Command = require("../lib/Command");
const {
	CommandCategories,
	OwnerID,
} = require("../lib/Constants");

// Better regional formatting
const regionFormat = region => {
	switch (region) {
		case "brazil":
			return "Brazil :flag_br:";
		case "eu-central":
			return "Central Europe :flag_eu:";
		case "eu-west":
			return "Western Europe :flag_eu:";
		case "hongkong":
			return "Hong Kong :flag_hk:";
		case "london":
			return "London :flag_gb:";
		case "japan":
			return "Japan :flag_jp:";
		case "russia":
			return "Russia :flag_ru:";
		case "singapore":
			return "Singapore :flag_sg:";
		case "southafrica":
			return "South Africa :flag_za:";
		case "sydney":
			return "Sydney :flag_au:";
		case "us-central":
			return "US Central :flag_us:";
		case "us-east":
			return "US East :flag_us:";
		case "us-south":
			return "US South :flag_us:";
		case "us-west":
			return "US West :flag_us:";
	}
};

class serverCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.GENERAL,
			description: "Shows info about the server.",
			aliases: ["serverinfo", "guildinfo", "guild", "guild-info", "server-info"],
			allowdisable: true,
		});
	}

	// Better verificationLevel
	async run(msg, args) {
		var verifitext = "null";
		var guild = msg.channel.guild;
		if (args[0] && OwnerID.includes(msg.author.id)) guild = await this.bot.guilds.find(g => g.name.toLowerCase().startsWith(args.join(" ")) || g.id == args.join(" "));
		else guild = msg.channel.guild;
		if (!guild) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "Either the guild was not found or I am not in it.",
				}),
			}); return;
		}
		if (guild.verificationLevel == 0) verifitext = "None";
		if (guild.verificationLevel == 1) verifitext = "Low";
		if (guild.verificationLevel == 2) verifitext = "Medium";
		if (guild.verificationLevel == 3) verifitext = "(╯°□°）╯︵ ┻━┻";
		if (guild.verificationLevel == 4) verifitext = "┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻";
		var bots = 0;
		var users = 0;
		await guild.members.forEach(mem => {
			if (mem.bot == true) {
				bots++;
			} else {
				users++;
			}
		});
		var voice = 0;
		var text = 0;
		await guild.channels.forEach(chan => {
			if (chan.type == 0) {
				text++;
			}
			if (chan.type == 2) {
				voice++;
			}
		});

		// Bots & Users
		var members = `${users} members, ${bots} bots.`;
		var channels = `${text} text, ${voice} voice channels`;
		msg.channel.createMessage({
			embed: this.embed({
				title: `${guild.name}`,
				thumbnail: {
					url: guild.iconURL,
				},
				fields: [{
					name: "Members",
					value: members,
					inline: true,
				}, {
					name: "Owner",
					value: this.bot.tag(guild.members.find(mem => mem.id == guild.ownerID)),
					inline: true,
				}, {
					name: "Channels",
					value: channels,
					inline: true,
				}, {
					name: "Verification Level",
					value: verifitext,
					inline: true,
				}, {
					name: "Created on:",
					value: this.bot.dateFormat(guild.createdAt),
					inline: true,
				}, {
					name: "Server ID",
					value: guild.id,
					inline: true,
				}, {
					name: "Roles",
					value: guild.roles.size,
					inline: true,
				}, {
					name: "Region",
					value: regionFormat(guild.region),
					inline: true,
				}],
			}),
		});
	}
}

module.exports = serverCommand;
