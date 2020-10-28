const os = require("os");
const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class infoCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.GENERAL,
			description: "Shows information about the bot.",
			aliases: ["about", "botinfo", "information"],
			allowdisable: false,
		});
	}

	async run(msg) {
		// Makes the platform field a bit better
		function guessOs(platform, release) {
			switch (platform) {
				case "darwin":
					return `macOS ${(parseFloat(release).toFixed(2) - parseFloat("7.6").toFixed(2) + parseFloat("0.03")).toFixed(2)}`;
				case "linux":
					return `Linux ${release}`;
				case "win32":
					return `Windows ${release}`;
				case "sunos":
					return `Solaris ${release}`;
				case "freebsd":
					return `FreeBSD ${release}`;
			}
		}
		// Gets the Eris version
		let erisver = `Eris ${require("eris").VERSION}`;
		msg.channel.createMessage({
			embed: this.embed({
				fields: [{
					name: "Users",
					value: this.bot.users.size,
					inline: true,
				}, {
					name: "Guilds",
					value: this.bot.guilds.size,
					inline: true,
				}, {
					name: "Uptime",
					// Calculates the uptime
					value: this.bot.toHHMMSS(process.uptime()),
					inline: true,
				}, {

					name: "Memory",
					// Calculates the free memory
					value: `${((os.totalmem() - os.freemem()) / 1024 ** 3).toFixed(2)}GiB / ${(os.totalmem() / 1024 ** 3).toFixed(2)}GiB`,
					inline: true,

				}, {
					name: "Shard",
					value: msg.channel.guild.shard.id,
					inline: true,
				}, {
					name: `Node Version`,
					value: process.version,
					inline: true,
				}, {
					name: "Platform",
					value: guessOs(os.platform(), os.release()),
					inline: true,
				}, {
					name: "Library",
					value: erisver,
					inline: true,
				}, {
					name: "Version",
					// Loads package.json for getting the version
					value: require("../package.json").version,
					inline: true,
				}],
			}),
		});
	}
}

module.exports = infoCommand;
