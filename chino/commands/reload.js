const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");

class reloadCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<command>",
			category: CommandCategories.OWNER,
			description: "Reloads a command or all commands.",
			aliases: ["rl"],
			allowDisable: false,
		});
	}

	async reloadModule(command) {
		const modPath = require.resolve(`./${command}`);
		const commandModule = require.cache[modPath];
		delete require.cache[modPath];
		let newCommand;
		try {
			newCommand = require(modPath);
		} catch (e) {
			if (commandModule) require.cache[modPath] = commandModule;
			throw {
				kind: 0,
				error: e,
			};
		}

		if (!(newCommand.prototype instanceof Command)) {
			if (commandModule) require.cache[modPath] = commandModule;
			throw {
				kind: 1,
				error: null,
			};
		}
		try {
			this.bot.commands.add(new newCommand(this.bot, this.bot.db, command), null, true);
		} catch (e) {
			if (commandModule) require.cache[modPath] = commandModule;
			throw {
				kind: 0,
				error: e,
			};
		}
		return true;
	}

	async reloadMultiple(msg, commands) {
		const m = await msg.channel.createMessage({
			embed: this.embed({
				title: "Reloading...",
				description: "This shouldn't take long, unless I encountered an error.",
			}),
		});
		const fields = await Promise.all(commands.map(c => c.toLowerCase()).map(async c => {
			if (!this.bot.commands.has(c)) {
				return {
					name: `${c} - Error`,
					value: "This command doesn't exist.",
				};
			}
			try {
				await this.reloadModule(c);
			} catch ({
				kind,
				error,
			}) {
				if (kind === 0) {
					return {
						name: `${c} - Error`,
						value: `Couldn't load the command: ${error.message}`,
					};
				} else if (kind === 1) {
					return {
						name: `${c} - Error`,
						value: "The command is not derived from the Command class",
					};
				}
			}
			return {
				name: `${c} - Success`,
				value: "This means everything has gone well!",
			};
		}));
		if (fields.length > 25) {
			await m.edit({
				embed: this.embed({
					title: "Success!",
					description: "The results have pushed me to my embed limits though.",
					color: 0x41ff70,
				}),
			});
		} else {
			await m.edit({
				embed: this.embed({
					title: "Error!",
					description: "You have to provide what you'd like me to reload.",
					fields,
					color: 0xff4242,
				}),
			});
		}
	}
	async run(msg, args) {
		if (args.length === 1) {
			const [command] = args;
			if (["*", "all", "everything"].includes(command.toLowerCase())) {
				await this.reloadMultiple(msg, this.bot.commands.map(c => c.id));
				return;
			}
			if (!this.bot.commands.has(command.toLowerCase())) {
				await msg.channel.createMessage({
					embed: this.errembed({
						title: "Error!",
						description: "Either the command doesn't exist or you're trying to load a new command or reload one that errored on startup. If so, please restart me.",
					}),
				});
				return;
			}

			const m = await msg.channel.createMessage({
				embed: this.embed({
					title: "Reloading...",
					description: "This shouldn't take long, unless I encountered an error.",
				}),
			});
			try {
				await this.reloadModule(command.toLowerCase());
			} catch ({
				kind,
				error,
			}) {
				if (kind === 0) {
					await m.edit({
						embed: this.embed({
							title: `Error reloading the command ${command.toLowerCase()}`,
							description: `\`\`\`js\n${error.stack}\n\`\`\``,
							footer: {
								text: "For your convenience, I restored the old module.",
							},
							color: 0xff4242,
						}),
					});
				} else if (kind === 1) {
					await m.edit({
						embed: this.embed({
							title: `Error reloading the command ${command.toLowerCase()}`,
							description: "The reloaded command is not derived from the Command class.",
							footer: {
								text: "For your convenience, I restored the old module.",
							},
							color: 0xff4242,
						}),
					});
				}
				return;
			}

			await m.edit({
				embed: this.embed({
					title: `Success! Finished reloading the command ${command.toLowerCase()}`,
					description: "There might be some wild errors in the run function though. Please test the command properly!",
					color: 0x41ff70,
				}),
			});
		} else {
			await this.reloadMultiple(msg, args);
		}
	}
}

module.exports = reloadCommand;
