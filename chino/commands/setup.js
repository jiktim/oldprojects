const Command = require("../lib/Command");
const {
	get,
} = require("snekfetch");
const ReactionMenu = require("../lib/ReactionMenu");
const {
	CommandCategories,
} = require("../lib/Constants");

// Starts the reaction menu
class SetupMenu extends ReactionMenu {
	constructor(msg1, msg2, bot, db) {
		super(msg2.id, msg1.channel.id, msg1.author.id, bot, db);
		this.options = {
			stopCallback: this.stopCallback.bind(this),

		};
		this.bot = bot;
		this.msg = msg1;
		this.botMsg = msg2;
		this.db = db;
		this.state = 0;

		this.prepareEmoji().then(null, () => "");
	}
	async prepareEmoji() {
		const toAdd = [ReactionMenu.STOP, SetupMenu.MUTED, SetupMenu.VERIFIED, SetupMenu.LEAVEJOIN, SetupMenu.MODLOG, SetupMenu.AGREECHANNEL, SetupMenu.AGREEROLE, SetupMenu.STARCHANNEL, SetupMenu.STARAMOUNT];
		for (const e of toAdd) await this.botMsg.addReaction(e);
	}
	// Exiting menu
	async stopCallback(reason) {
		this.unbind();
		try {
			if (reason === ReactionMenu.MANUAL_EXIT) {
				await this.botMsg.delete();
				await this.msg.channel.createMessage({
					embed: {
						color: 0xff4242,
						title: "Setup",
						description: "You have left the menu.",
						timestamp: new Date(),
					},
				});
			} else if (reason === ReactionMenu.MESSAGE_DELETE) {
				await this.msg.channel.createMessage("The menu has stopped because the message the menu was in was deleted.").then(m => setTimeout(() => m.delete(), 5000));
			} else if (reason === ReactionMenu.CHANNEL_DELETE) {
				await this.bot.users.get(this.authorID).getDMChannel().then(dm => dm.createMessage("The menu has stopped because the channel the menu was in was deleted."));
			}
		} catch (_) {}
	}
	// If the bot can't remove their reactions
	async handleReactionAdd(msg, emoji, id) {
		if (!super.handleReactionAdd(msg, emoji, id)) return;
		if (this.stopped) return;
		try {
			await this.botMsg.removeReaction(emoji.name, id);
		} catch (_) {
			if (!this.reactionErrored) {
				this.reactionErrored = true;
				this.botMsg.channel.createMessage("I can't remove your reactions because I'm missing the manageMessages permission. If this permission is granted I'll automatically remove your reaction for your convenience.");
			}
		}
		if (this.state === 1) return;
		const cb = this.getCb(emoji.name);
		if (cb) cb();
	}
	// Ask for the {thing}
	async askFor(thing, fieldName) {
		this.state = 1;
		this.botMsg.edit({
			embed: {
				color: 0x7289DA,
				title: `Type in the ${thing !== "number" ? `${thing} name` : "number"}.`,
				description: `You have 15 seconds before this expires.`,
			},
		});
		// DB
		let fails = 0;
		let guildConfig = this.msg.guildConfig;
		if (!guildConfig) {
			guildConfig = {
				id: this.msg.guild.id,
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
			await this.db.table("guildconfig").insert(guildConfig);
		}
		// Failure to do {thing} 3 times
		while (true) {
			if (fails === 3) {
				await this.msg.channel.createMessage({
					embed: {
						color: 0xff4242,
						title: "Error!",
						description: `You failed to provide a ${thing} name 3 times so I am exiting the menu for you.`,
						timestamp: new Date(),
					},
				});
				break;
			} else {
				try {
					const [m] = await this.bot.waitForEvent("messageCreate", 12500, m => {
						if (m.author.id !== this.msg.author.id) return;
						if (m.channel.id !== this.msg.channel.id) return;
						return true;
					});

					m.delete();

					if (m.content.toLowerCase() === "cancel") {
						m.channel.createMessage({
							embed: {
								title: "Setup",
								description: "Exiting the menu.",
								color: 0xff4242,
								timestamp: new Date(),
							},
						});
						break;
					}
					if (thing === "number" && !isNaN(m.content)) {
						guildConfig[fieldName] = m.content;
						await this.db.table("guildconfig").get(m.guild.id).update(guildConfig);
						m.channel.createMessage({
							embed: {
								color: 0x41ff70,
								title: "Success!",
								description: `I have updated the ${thing}.`,
								timestamp: new Date(),
							},
						});
						return;
					}
					const r = await m.channel.guild[thing === "role" ? "roles" : "channels"].find(r => r.id === m.content || r.mention === m.content || r.name.toLowerCase().includes(m.content.toLowerCase()));
					// Not found
					if (!r && thing !== "number") {
						m.channel.createMessage({
							embed: {
								color: 0xff4242,
								title: "Error!",
								description: `${thing[0].toUpperCase() + thing.slice(1)} not found.`,
								timestamp: new Date(),
							},
						});
						fails++;
						// Agree channel embed
					} else {
						guildConfig[fieldName] = r.id;
						await this.db.table("guildconfig").get(m.guild.id).update(guildConfig);
						if (thing === "channel" && fieldName === "agreeChannel") {
							r.createMessage({
								embed: {
									color: 0x7289DA,
									title: "Verification",
									description: "In order to view the rest of the channels, type `-agree`.",
									thumbnail: {
										url: "https://i.imgur.com/PSoqFFv.png",
									},
								},
							});
						}
						// Updated
						m.channel.createMessage({
							embed: {
								color: 0x41ff70,
								title: "Success!",
								description: `I have updated the ${thing}.`,
								timestamp: new Date(),
							},
						});
						break;
					}
					// Timeout
				} catch (_) {
					// console.log(_)
					this.msg.channel.createMessage({
						embed: Command.prototype.errembed({
							title: "Error!",
							description: "You didn't respond in time, so I am returning to the main menu.",
						}),
					});
					break;
				}
			}
		}

		await this.botMsg.edit({
			embed: SetupMenu.mainMenu,
		});
		this.state = 0;
	}
	// Logging
	async modLogSubMenu() {
		this.state = 1;
		const obj = {
			embed: Command.prototype.embed({
				title: `Logging`,
				description: "Type the letters at the left to get around this menu.",
				fields: [{
					name: `h: Home`,
					value: `Takes you back to the main menu.`,
				}, {
					name: `c: Set the logging channel`,
					value: `The channel where the events you selected will be logged.`,
				}, {
					name: `e: Set the logging events`,
					value: `Sets what you would like me to log.`,
				}, {
					name: `s: Show the logging events`,
					value: `Lists what events I can log.`,
				}],
			}),
		};
		await this.botMsg.edit(obj);
		while (true) {
			try {
				const [m] = await this.bot.waitForEvent("messageCreate", 15000, m => {
					if (m.author.id !== this.msg.author.id) return;
					if (m.channel.id !== this.msg.channel.id) return;
					if (!["h", "c", "e", "s"].includes(m.content.toLowerCase())) return;
					return true;
				});

				if (m.content.toLowerCase() === "h") {
					await this.botMsg.edit({
						embed: SetupMenu.mainMenu,
					});
					this.state = 0;
					break;
				} else if (m.content.toLowerCase() === "c") {
					await this.askFor("channel", "loggingChannel");
					this.state = 1;
					await this.botMsg.edit(obj);
				} else if (m.content.toLowerCase() === "e") {
					await this.botMsg.edit({
						embed: Command.prototype.embed({
							title: "setup",
							description: "Type what events you want me to log, separated by a comma (,). It's recommended to just type `all`.",
						}),
					});
					const [m] = await this.bot.waitForEvent("messageCreate", 15000, m => {
						if (m.author.id !== this.msg.author.id) return;
						if (m.channel.id !== this.msg.channel.id) return;
						return true;
					});
					let guildConfig = this.msg.guildConfig;
					if (!guildConfig) {
						guildConfig = {
							id: this.msg.guild.id,
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
						await this.db.table("guildconfig").insert(guildConfig);
					}

					m.delete();
					// Exits
					if (m.content.toLowerCase() === "cancel") {
						m.channel.createMessage({
							embed: {
								color: 0xff4242,
								title: "Setup",
								description: "Exiting the menu.",
								timestamp: new Date(),
							},
						});

						await this.botMsg.edit(obj);
						continue;
					}
					// Error during logging
					const eventsToLog = m.content.split(",").map(s => s.trim()).filter(s => !!s);
					if (eventsToLog.length === 0) {
						m.channel.createMessage({
							embed: {
								color: 0xff4242,
								title: "Error!",
								description: "Not like this. Provide some logging events or type in 'none' to disable logging. Otherwise, type 'all' to enable all logging.",
								timestamp: new Date(),
							},
						});

						await this.botMsg.edit(obj);
						continue;
					}
					guildConfig.loggingEvents = eventsToLog.includes("none") ? [] : eventsToLog;
					await this.db.table("guildconfig").get(m.guild.id).update(guildConfig);
					m.channel.createMessage({
						embed: {
							color: 0x41ff70,
							title: "Success!",
							description: `I have updated the logging events.`,
							timestamp: new Date(),
						},
					});
					// Log events list
					await this.botMsg.edit(obj);
				} else if (m.content.toLowerCase() === "s") {
					await m.channel.createMessage({
						embed: Command.prototype.embed({
							title: "Here's what I can log",
							description: ["all",
								"meritAdd",
								"meritRemove",
								"strikeAdd",
								"strikeRemove",
								"commandDisable",
								"commandEnable",
								"assignableRoleAdd",
								"assignableRoleRemove",
								"guildBan",
								"guildUnban",
								"guildKick",
								"messageNuke",
								"memberVerify",
								"memberMute",
								"memberUnverify",
								"memberUnmute",
								"guildPrefixChange",
							].map(s => `- ${s}`).join("\n"),
						}),
					});
				}
			} catch (_) {
				// Timeout
				await this.msg.channel.createMessage({
					embed: Command.prototype.errembed({
						title: "Error!",
						description: "You didn't respond in time, so I am returning to the main menu.",
					}),
				});
				await this.botMsg.edit({
					embed: SetupMenu.mainMenu,
				});
				this.state = 0;
				break;
			}
		}
	}

	getCb(emoji) {
		if (emoji === SetupMenu.MUTED) {
			return async() => await this.askFor("role", "muted");
		} else if (emoji === SetupMenu.VERIFIED) {
			return async() => await this.askFor("role", "verified");
		} else if (emoji == SetupMenu.LEAVEJOIN) {
			return async() => await this.askFor("channel", "leavejoin");
		} else if (emoji == SetupMenu.AGREECHANNEL) {
			return async() => await this.askFor("channel", "agreeChannel");
		} else if (emoji == SetupMenu.AGREEROLE) {
			return async() => await this.askFor("role", "agreeRole");
		} else if (emoji == SetupMenu.MODLOG) {
			return this.modLogSubMenu.bind(this);
		} else if (emoji == SetupMenu.STARCHANNEL) {
			return async() => await this.askFor("channel", "starChannel");
		} else if (emoji == SetupMenu.STARAMOUNT) {
			return async() => await this.askFor("number", "starAmount");
		} {
			return null;
		}
	}

	get [Symbol.toStringTag]() {
		return `SetupMenu, original message ${this.msg.id}, bot message ${this.botMsg.id}`;
	}
	// More emoji reactions
	static get mainMenu() {
		return Command.prototype.embed({
			fields: [{
				name: "Muted Role 🔇",
				value: "Sets the role given when -mute is run.",
			}, {
				name: "Verified Role ✅",
				value: "Sets the role given when -verify is run.",
			}, {
				name: "Leave/join channel 👋",
				value: "Sets the channel that leave/join messages will be posted.",
			}, {
				name: "Logging channel/events 📜",
				value: "Sets the channel and events for logging.",
			}, {
				name: "Agreement channel 💬",
				value: "Sets the channel that members run -agree.",
			}, {
				name: "Agreement role 👤",
				value: "Sets the role given when -agree is run.",
			}, {
				name: "Starboard channel 🌠",
				value: "Sets the channel where the starboard posts to.",
			}, {
				name: "Starboard count #⃣",
				value: "Sets the amount of stars needed for the starboard.",
			}],
			footer: {
				text: `You can react with ${ReactionMenu.STOP} to leave the menu.`,
			},
		});
	}
}
// More reaction stuff
SetupMenu.MUTED = "🔇";
SetupMenu.VERIFIED = "✅";
SetupMenu.LEAVEJOIN = "👋";
SetupMenu.MODLOG = "📜";
SetupMenu.AGREECHANNEL = "💬";
SetupMenu.AGREEROLE = "👤";
SetupMenu.STARCHANNEL = "🌠";
SetupMenu.STARAMOUNT = "#⃣";

class setupCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.MODERATION,
			description: "Sets up the bot for your server.",
			requiredPerms: "manageGuild",
			allowdisable: false,
		});
	}
	// Stuff
	async run(msg, args) {
		const setupMsg = await msg.channel.createMessage({
			embed: SetupMenu.mainMenu,
		});
		const m = new SetupMenu(msg, setupMsg, this.bot, this.db);
		m.start();
	}
}

module.exports = setupCommand;
