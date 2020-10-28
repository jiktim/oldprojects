const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class enableCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<command>",
			category: CommandCategories.MODERATION,
			description: "Disable a command in your server.",
			requiredPerms: "manageGuild",
			aliases: ["disable", "disablecommand"],
			allowDisable: false,
		});
	}
	async run(msg, [command]) {
		// If no command name is given, error out, else continue.
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
		// If no guildConfig is setup, create it.
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
		// If the command is already disabled, error out, else continue.
		if (guildConfig.disabledCmds.includes(command)) {
			msg.channel.createMessage({
				embed: this.errembed({
					title: `Error!`,
					description: `This command is already disabled.`,
				}),
			});
			return;
		}
		// If the command is found, disable it and add it to the DB.
		if (cmds.find(c => c.id === command)) {
			guildConfig.disabledCmds.push(command);
			this.bot.emit("commandDisable", msg.guild, command, msg.member);
			await this.db.table("guildconfig").get(msg.channel.guild.id).update(guildConfig);
			msg.channel.createMessage({
				embed: this.succembed({
					title: `Success!`,
					description: `Successfully disabled the command.`,
				}),
			});
		} else {
		// if the command was not found, error out.
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
