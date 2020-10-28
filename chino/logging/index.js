const Logging = require("./lib/Logging");
const request = require("snekfetch");
const {
	LogChannelID,
	DBLToken,
} = require("../config.json");
const {
	prototype: {
		embed,
		errembed,
		succembed,
	},
} = require("../lib/Command");
const Eris = require("eris");
// Gets the logging configuration of the guild.
module.exports = (bot, db) => {
	async function _doPost(key = "", url = "", pld = {
		server_count: bot.guilds.size,
	}) {
		if (!key || !url || !pld) return;
		let data;
		try {
			data = await request.post(url)
				.set("Authorization", key)
				.send(pld);
		} catch (err) {
			console.log(err);
		}
	}
	const loggingFacility = new Logging(db);
	const canSendLog = async(guild, event) => {
		const canLog = await loggingFacility.canLog(guild, event);
		if (!canLog) return;
		const channel = await loggingFacility.getLoggingChannel(guild);
		if (guild.channels.has(channel)) return channel;
	};
	// Sends the logging embeds.
	const trySendLog = async(guild, event, embed2) => {
		const channel = await canSendLog(guild, event);
		if (channel) {
			bot.createMessage(channel, { embed: embed2 });
		}
	};
	// Logs merit add and removes.
	bot.on("meritAdd", (guild, giver, receiver, id, reason) => trySendLog(guild, "meritAdd", succembed({
		title: `${receiver.username} was given a merit by ${giver.username}.`,
		description: `Reason: ${reason}`,
		fields: [{
			name: "ID:",
			value: id,
		}],
	})))
		.on("meritRemove", (guild, user, ids) => trySendLog(guild, "meritRemove", errembed({
			title: `${user.username} has removed some merits.`,
			fields: [{
				name: "IDs:",
				value: ids.join(", "),
			}],
		})))
		// Logs strike add and removes.
		.on("strikeAdd", (guild, giver, receiver, id, reason) => trySendLog(guild, "strikeAdd", errembed({
			title: `${receiver.username} was striked by ${giver.username}.`,
			description: `Reason: ${reason}`,
			fields: [{
				name: "ID:",
				value: id,
			}],
		})))
		.on("strikeRemove", (guild, user, ids) => trySendLog(guild, "strikeRemove", succembed({
			title: `${user.username} has removed some strikes.`,
			fields: [{
				name: "IDs:",
				value: ids.join(", "),
			}],
		})))
		// Logs command disable and enable.
		.on("commandDisable", (guild, command, user) => trySendLog(guild, "commandDisable", errembed({
			author: {
				name: `${user.username} disabled a command.`,
				icon_url: user.avatarURL,
			},
			fields: [{
				name: "Command name:",
				value: command,
			}],
		})))
		.on("commandEnable", (guild, command, user) => trySendLog(guild, "commandEnable", succembed({
			author: {
				name: `${user.username} enabled a command.`,
				icon_url: user.avatarURL,
			},
			fields: [{
				name: "Command name:",
				value: command,
			}],
		})))
		// Logs assignable roles being added and removed.
		.on("assignableRoleAdd", (guild, user, role) => trySendLog(guild, "assignableRoleAdd", succembed({
			author: {
				name: `${user.username} added an assignable role.`,
				icon_url: user.avatarURL,
			},
			fields: [{
				name: "Role name",
				value: role.name,
			}],
		})))
		.on("assignableRoleRemove", (guild, user, role) => trySendLog(guild, "assignableRoleRemove", errembed({
			author: {
				name: `${user.username} removed an assignable role.`,
				icon_url: user.avatarURL,
			},
			fields: [{
				name: "Role name:",
				value: role.name,
			}],
		})))
		// Logs bans & unbans.
		.on("guildBanAdd", (guild, user) => trySendLog(guild, "guildBan", errembed({
			author: {
				name: `${user.username} was banned.`,
				icon_url: user.avatarURL,
			},
		})))
		.on("guildBanRemove", (guild, user) => trySendLog(guild, "guildUnban", succembed({
			author: {
				name: `${user.username} was unbanned.`,
				icon_url: user.avatarURL,
			},
		})))
		// Logs kicks
		.on("guildKick", (guild, user, member, reason) => trySendLog(guild, "guildKick", embed({
			title: `${member.username} was kicked.`,

			description: `Reason: ${reason}`,
			fields: [{
				name: "Kicked by",
				value: bot.tag(user),
			}],
			color: 0x41ff70,
		})))
		// Nuke command logging
		.on("messageDeleteBulk", async messages => {
			if (!messages[0].channel.guild) return;
			const channel = await canSendLog(messages[0].channel.guild, "messageNuke");
			if (!channel) return;
			const messageText = messages.map(m => `${bot.tag(m.author || { username: "Unknown User", discriminator: "0000" })} (message ID: ${m.id}): ${m.content || "No content"}`);
			bot.createMessage(channel, {
				embed: errembed({
					title: `${messages.length} messages were nuked.`,
					footer: {
						text: `Deleted messages are bundled as a text file.`,
					},
				}),
			}, {
				file: Buffer.from(messageText.join("\r\n")),
				name: "deleted-messages.txt",
			});
		})
		// Logs verify, mute, unverify, & unmute.
		.on("memberVerify", (guild, user, member) => trySendLog(guild, "memberVerify", succembed({
			title: `${member.username} was given the verified role.`,
			fields: [{
				name: "Verified by:",
				value: bot.tag(user),
			}],
		})))
		.on("memberMute", (guild, user, member) => trySendLog(guild, "memberMute", errembed({
			title: `${member.username} was muted.`,
			fields: [{
				name: "Muted by:",
				value: bot.tag(user),
			}],
		})))
		.on("memberUnverify", (guild, user, member) => trySendLog(guild, "memberUnverify", errembed({
			title: `${member.username} was unverified.`,
			fields: [{
				name: "Unverified by:",
				value: bot.tag(user),
			}],
		})))
		.on("memberUnmute", (guild, user, member) => trySendLog(guild, "memberUnmute", succembed({
			title: `${member.username} was unmuted.`,
			fields: [{
				name: "Unmuted by:",
				value: bot.tag(user),
			}],
		})))
		// Logs if the prefix is changed.
		.on("guildPrefixChange", (guild, prefix) => trySendLog(guild, "guildPrefixChange", embed({
			title: `The prefix for this server has changed.`,
			fields: [{
				name: "New prefix:",
				value: prefix,
			}],
			color: 0x41ff70,
		})))
		// Logs message deletions & updates.
		.on("messageDelete", async message => {
			// if (message.author.id === bot.user.id) return;
			if (!message.channel.guild) return;
			if (!message.author) return;
			if (message.author.bot) return;
			const channel = await canSendLog(message.channel.guild, "messageDelete");
			if (!channel) return;
			bot.createMessage(channel, {
				embed: errembed({
					author: {
						name: `${message.author.username}'s message has been deleted.`,
						icon_url: message.author.avatarURL,
					},
					title: "Old content",
					description: message.content || "No content",
					fields: [{
						name: `Channel`,
						value: message.channel.mention,
						inline: true,
					}, {
						name: "ID",
						value: message.id,
						inline: true,
					}],
				}),
			});
		})
		.on("messageUpdate", async(message, oldMessage) => {
			// if (message.author.id === "BOT ID") return;
			if (!oldMessage) return;
			if (!message.channel.guild) return;
			if (!message.author) return;
			if (message.author.bot) return;
			if (message.content === oldMessage.content) return;
			let channel = await canSendLog(message.channel.guild, "messageUpdate");
			if (!channel) return;
			const text = Buffer.from(message.content.replace(/\n/g, "\r\n"));
			bot.createMessage(channel, {
				embed: embed({
					author: {
						name: `${message.author.username}'s message has been updated.`,
						icon_url: message.author.avatarURL,
					},
					title: "Old content",
					description: oldMessage.content || "No content",
					color: 0x41ff70,
				}, message.content.length <= 1024 ? {
					fields: [{
						name: "New content",
						value: message.content || "No content",
					}],
				} : {
					footer: {
						text: "The new message content was too long to send in an embed, so I bundled it in a text file instead.",
					},
				}),
			}, message.content.length > 1024 ? {
				file: text,
				name: "new-message-content.txt",
			} : null);
		})

		.on("guildMemberAdd", async function(guild, member) {
			try {
				const guildConfig = await this.db("chino").table("guildconfig").get(guild.id);
				let leavejoin = guildConfig.leavejoin;
				if (!leavejoin) return;
				let logchannel = guild.channels.find(o => o.id == leavejoin);
				if (!logchannel) return;
				logchannel.createMessage({
					embed: {
						title: `Member Joined`,
						description: `**${member.username}#${member.discriminator}** has joined **${guild.name}**. 😄`,
						color: 0x41ff70,
						footer: {
							text: `User ID: ${member.id}`,
						},
					},
				});
			} catch (e) {
				// Raven.captureException(e);
				// console.log(e);
			}
		})
		.on("guildMemberRemove", async(guild, member) => {
			try {
				const guildConfig = await db("chino").table("guildconfig").get(guild.id);
				let leavejoin = guildConfig.leavejoin;
				if (!leavejoin) return;
				let logchannel = guild.channels.find(o => o.id == leavejoin);
				if (!logchannel) return;
				logchannel.createMessage({
					embed: {
						title: `Member Left`,
						description: `**${member.username}#${member.discriminator}** has left **${guild.name}**. 😦`,
						color: 0xff4242,
						footer: {
							text: `User ID: ${member.id}`,
						},
					},
				});
			} catch (e) {
				// console.log(e)
			}
		})
		.on("guildCreate", async guild => {
			// Updates the DBL page when the bot's added to a guild.
			if (DBLToken) {
				try {
					await _doPost(DBLToken, `https://discordbots.org/api/bots/${bot.user.id}/stats`);
				} catch (err) {
					throw err;
				}
			}
			const b = await db("chino").table("blacklist").filter({
				guild: guild.id,
			});
			// Logs if the bot is added to a blacklisted server & DMs the user that they have been blacklisted.
			if (b.find(g => g.guild === guild.id)) {
				console.log(`I was added to a blacklisted server: ${guild.name}`);
				try {
					const dm = await owner.user.getDMChannel();
					await dm.createMessage({
						embed: {
							title: `Blacklist`,
							description: `Your server has been blacklisted.`,
							color: 0xff4242,
							timestamp: new Date(),
						},
					});
				} catch (e) {
					console.log("I couldn't DM the owner of a blacklisted server.");
				}
				await guild.leave();
				return;
			}
			// Logs to the console and DMs the guild owner when the bot is added to a server.
			console.log(`Added to server: ${guild.name}`);
			const bots = guild.members.filter(m => m.bot).length;
			const owner = guild.members.get(guild.ownerID);
			const dm = await owner.user.getDMChannel();
			try {
				await dm.createMessage({
					embed: {
						title: "Chino",
						description: "I was added to a guild you own. Please run `-setup` in your server so I can function correctly.",
						color: 0x7289DA,
						timestamp: new Date(),
					},
				});
			} catch (e) {}
			// Logs to the set channel in config.json when the bot is added to a guild.
			bot.createMessage(LogChannelID, {
				embed: {
					title: `Added to server: ${guild.name}`,
					description: `**ID:** ${guild.id}\n**Owner:** ${bot.tag(owner)}\n**Owner ID:** ${owner.id}\n**Region:** ${guild.region}\n**Shard ID:** ${guild.shard.id}`,
					timestamp: new Date(),
					color: 0x41ff70,
					thumbnail: {
						url: guild.iconURL || "https://i.imgur.com/CP2ukWX.png",
					},
					footer: {
						text: `The guild has ${guild.memberCount - bots} members and ${bots} bots.`,
					},
				},
			});
		})
		// Logs to the console, the channel set in config.json, and updates DBL when the bot is removed from a server.
		.on("guildDelete", async guild => {
			console.log(`Removed from server: ${guild.name}`);
			if (DBLToken) {
				try {
					await _doPost(DBLToken, `https://discordbots.org/api/bots/${bot.user.id}/stats`);
				} catch (err) {
					throw err;
				}
			}
			const bots = guild.members.filter(m => m.bot).length;
			const owner = guild.members.get(guild.ownerID);
			bot.createMessage(LogChannelID, {
				embed: {
					title: `Removed from server - ${guild.name}`,
					description: `**ID:** ${guild.id}\n**Owner:** ${bot.tag(owner)}\n**Owner ID:** ${owner.id}\n**Region:** ${guild.region}\n**Shard ID:** ${guild.shard.id}`,
					timestamp: new Date(),
					color: 0xff4242,
					thumbnail: {
						url: guild.iconURL || "https://i.imgur.com/CP2ukWX.png",
					},
					footer: {
						text: `The guild had ${guild.memberCount - bots} members and ${bots} bots.`,
					},
				},
			});
		})
	// Starboard
		.on("messageReactionRemove", async(msg, emoji) => {
			if (!msg.content) {
				msg = await msg.channel.getMessage(msg.id);
			}
			if (msg.author.bot === true) return;
			if (msg.reactions["⭐"] && msg.reactions["⭐"].count) {
				let guildcfg = await db.table("guildconfig").get(msg.channel.guild.id);
				if (guildcfg && guildcfg.starChannel && guildcfg.starAmount && parseInt(guildcfg.starAmount) <= msg.reactions["⭐"].count) {
					const starChannel = await msg.channel.guild.channels.get(guildcfg.starChannel);
					if (!starChannel) return;
					const getmsgs = await starChannel.getMessages(50);
					const star = getmsgs.find(m => m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(msg.id));
					/* eslint-disable */
							if (star) {
								let embed = star.embeds[0];
								embed.footer.text = `⭐${msg.reactions["⭐"].count} stars | ${msg.id}`;
								star.edit({ embed: embed });
							}
						}
					}
				})
				.on("messageReactionAdd", async(msg, emoji) => {
					let embedconstruct = {};
					if (!msg.content) {
						msg = await msg.channel.getMessage(msg.id);
					}
					if (msg.author.bot === true) return;
					if (msg.reactions["⭐"] && msg.reactions["⭐"].count) {
						let guildcfg = await db.table("guildconfig").get(msg.channel.guild.id);
						if (guildcfg && guildcfg.starChannel && guildcfg.starAmount && parseInt(guildcfg.starAmount) <= msg.reactions["⭐"].count) {
							const starChannel = await msg.channel.guild.channels.get(guildcfg.starChannel);
							if (!starChannel) return;
							const getmsgs = await starChannel.getMessages(100);
							const star = getmsgs.find(m => m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(msg.id));
							if (star) {
								let embed = star.embeds[0];
								embed.footer.text = `⭐${msg.reactions["⭐"].count} stars | ${msg.id}`;
								star.edit({ embed: embed });
								return;
							}
							embedconstruct = {
								embed: {
									title: "Content",
									color: 0xffff47,
									footer: {
										text: `⭐${msg.reactions["⭐"].count} stars | ${msg.id}`,
									},
									fields: [{
										name: "Author",
										value: msg.member.mention,
										inline: true,
									},
									{
										name: "Channel",
										value: msg.channel.mention,
										inline: true,
									},
									],
								},
							};
							if (msg.content) embedconstruct.embed.description = msg.content || "No content";
							const urlCheck = msg.content.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g);
							if (urlCheck || msg.attachments[0]) {
								urlCheck && urlCheck.length > 0 ? urlCheck[0] : msg.attachments[0].url;
								embedconstruct.embed.image = { url: urlCheck && urlCheck.length > 0 ? urlCheck[0] : msg.attachments[0].url };
							}
							bot.createMessage(guildcfg.starChannel, embedconstruct);
						}
					}
				});
		
};

