const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class enableCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<command>",
			category: CommandCategories.MODERATION,
			description: "Enable a command that was previously disabled.",
			requiredPerms: "manageGuild",
			aliases: ["enable", "enablecommand"],
			allowDisable: false,
		});
	}
	// If no command with that name was found
	async run(msg, [command]) {
		const cmds = this.bot.commands.filter(cmd => cmd.allowDisable || true);
		if (!command) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `You have to provide a command name.`,
				}),
			});
			return;
		}
		// Reads the DB
		let guildConfig = msg.guildConfig;
		if (!guildConfig) {
			guildConfig = {
				id: this.msg.guild.id,
				verified: null,
				starboard: null,
				muted: null,
				disabledCmds: [],
				customPrefix: null,
				leavejoin: null,
				agreeChannel: null,
				agreeRole: null,
				starChannel: null,
				starAmount: null,
			};
			msg.guildConfig = await this.db.table("guildconfig").insert(guildConfig);
		}
		// If the command is already disabled
		if (!guildConfig.disabledCmds.includes(command)) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `This command is already enabled.`,
				}),
			});
			return;
		}
		// Delete the DB entry & re-enable the command.
		if (cmds.find(c => c.id === command)) {
			guildConfig.disabledCmds.splice(guildConfig.disabledCmds.indexOf(command), 1);
			this.bot.emit("commandEnable", msg.guild, command, msg.member);
			await this.db.table("guildconfig").get(msg.channel.guild.id).update(guildConfig);
			msg.channel.createMessage({
				embed: this.succembed({
					title: `Success!`,
					description: `Successfully enabled command.`,
				}),
			});
		} else {
		// If the command can't be disabled/enabled (Deprecated)
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `The command was not found or is not allowed to be enabled or disabled.`,
				}),
			});
		}
	}
}

module.exports = enableCommand;
