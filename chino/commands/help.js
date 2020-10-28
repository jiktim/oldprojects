const Command = require("../lib/Command");
const {
	CommandCategories,
	CommandCategoriesText,
	CommandCategoriesColor,
	OwnerID,
} = require("../lib/Constants");
const {
	prefix,
} = require("../config.json");
class HelpCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.GENERAL,
			description: "Displays the help menu.",
			aliases: ["commands"],
			allowdisable: false,
		});
	}

	async run(msg, args) {
		const o = {};
		Object.keys(CommandCategories).forEach(
			v => o[CommandCategories[v]] = []
		);

		// Shows the info on each line of the help command.
		this.bot.commands.forEach(c => {
			const {
				category,
				description,
				id,
				usage,
				aliases,
				requiredPerms,
			} = c;
			if (!o[category]) return;
			o[category].push({
				description,
				name: id,
				usage,
				aliases,
				requiredPerms,
			});
		});
		if (args.length === 0) {
			const access = [
				true,
				true,
				true,
				OwnerID.includes(msg.author.id),
				true,
				msg.channel.nsfw,
			];
			// Creates the list of commands on the help menu.
			await msg.channel.createMessage({
				embed: this.embed({
					title: "Here are the commands you can use. Type -help command for more details.",
					fields: Object.keys(o).filter(k => access[k]).filter(k => o[k].length !== 0)
						.map(k => {
							const obj = o[k];
							return {
								name: CommandCategoriesText[k],
								value: `${obj.map(n => `\`${n.name}\``).join(" ")}`,
							};
						}),
					footer: {
						text: `${this.bot.commands.size} commands`,
					},
				}),
			});
		} else {
			// If the command can't be found, error out.
			var cmd = this.bot.commands.find(o => o.id.startsWith(args.join(" ")));
			var AliasCmd = this.bot.commands.find(o => o.aliases.includes(args.join(" ")));
			if (!cmd && !AliasCmd) {
				msg.channel.createMessage({
					embed: this.errembed({
						title: `Error!`,
						description: `Command not found.`,
					}),
				});
				return;
			}
			// Allows -help <alias>
			if (!cmd) cmd = AliasCmd;
			msg.channel.createMessage({
				embed: {
					title: cmd.id,
					color: CommandCategoriesColor[cmd.category],
					description: cmd.description,
					fields: [{
						name: "Aliases",
						value: cmd.aliases.join(", ") || "No aliases",
					}, {
						name: "Category",
						value: CommandCategoriesText[cmd.category],
					}, {
						name: "Usage",
						value: `${prefix}${cmd.id} ${cmd.usage || ""}`,
					}, {
						name: "Required permissions",
						value: cmd.requiredPerms || "None",
					}],
				},
			});
		}
	}
}

module.exports = HelpCommand;
