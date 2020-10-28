const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class prefixCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<prefix>",
			category: CommandCategories.MODERATION,
			description: "Sets the prefix of the bot.",
			requiredPerms: "manageGuild",
			allowdisable: false,
		});
	}
	// No args = show current prefix.
	async run(msg, args) {
		if (!args[0]) {
			await msg.channel.createMessage({
				embed: this.embed({
					title: "Prefix",
					description: `The current prefix is **${(msg.guildConfig && msg.guildConfig.customPrefix) || "-"}**`,
				}),
			});
			return;
		}
		// More than 15 chars = error
		if (args.join(" ").length > 15) {
			await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: "You can't set a prefix more than 15 characters.",
				}),
			});
			return;
		}
		// DB
		let guildConfig = msg.guildConfig;
		if (!guildConfig) {
			guildConfig = {
				id: msg.guild.id,
				verified: null,
				starboard: null,
				muted: null,
				disabledCmds: [],
				customPrefix: "-",
				leavejoin: null,
				agreeChannel: null,
				agreeRole: null,
				starChannel: null,
				starAmount: null,
			};
			msg.guildConfig = await this.db.table("guildconfig").insert(guildConfig);
		}
		if (args.length <= 15) {
			guildConfig.customPrefix = args.join(" ");
			await this.db.table("guildconfig").get(msg.channel.guild.id).update(guildConfig);
			this.bot.emit("guildPrefixChange", msg.guild, args.join(" "));
			msg.channel.createMessage({
				embed: this.succembed({
					title: `Success!`,
					description: `Successfully changed prefix.`,
				}),
			});
		} else {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `You can't have a prefix over 15 characters.`,
				}),
			});
		}
	}
}

module.exports = prefixCommand;
