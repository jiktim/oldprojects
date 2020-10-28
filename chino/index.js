const Eris = require("eris");
const Client = require("./lib/ChinoClient.js");
const request = require("snekfetch");
const Raven = require("raven");
const startTime = new Date();
const ch = require("chalk");
const {
	CommandCategories,
	OwnerID,
} = require("./lib/Constants.js");
const {
	token,
	prefix,
	rethinkDB,
	sentryDSN,
	LogChannelID,
	DBLToken,
} = require("./config.json");
const {
	version,
} = require("./package.json");
process.env.DMLogging = true;

Object.defineProperty(Eris.Message.prototype, "guild", {
	get: function() {
		return this.channel.guild;
	},

});
const db = require("rethinkdbdash")(rethinkDB);
const bot = new Client(token, {
	disableEveryone: true,
	getAllUsers: true,
}, db);
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
		Raven.captureException(err);
		console.log(err);
	}
}
// Sets the bot's status to the games defined.
function setGame(games) {
	bot.editStatus("online", {
		name: `${version}`,
	});
}
bot.on("ready", async() => {
	if (sentryDSN) {
		Raven.config(sentryDSN).install();
	}
	// Loads each command & logs it to the console.
	await bot.loadCommands();
	console.log(`${bot.user.username}, ready to serve! ${bot.commands.size} commands loaded. (it took ${new Date(new Date() - startTime).getSeconds()}.${new Date(new Date() - startTime).getMilliseconds()} second(s) to start up)`);
	// Sets the bot's status
	setGame();
	// Updates the DBL page when the bot goes online.
	if (DBLToken) {
		try {
			return await _doPost(DBLToken, `https://discordbots.org/api/bots/${bot.user.id}/stats`);
		} catch (err) {
			Raven.captureException(err);
			throw err;
		}
	}
});
// Logs to the channel set in config.json when someone DMs the bot.
bot.on("messageCreate", async msg => {
	if (msg.author.bot) return;
	if (msg.channel instanceof Eris.PrivateChannel) {
		if (msg.author.id != bot.user.id && process.env.DMLogging == "true") {
			await bot.createMessage(LogChannelID, {
				embed: {
					author: {
						name: `I was messaged by ${msg.author.username}#${msg.author.discriminator}.`,
						icon_url: msg.author.avatarURL,
					},
					description: `Content: ${msg.content}`,
					timestamp: new Date(),
					color: 0x7289DA,
				},
			});
		}
		return;
	}
	// Prefix stuff
	const guildConfig = msg.guildConfig = await db.table("guildconfig").get(msg.guild.id);
	function prefixConfig(guildcfg) {
		let prefixLength = 0;
		if (guildcfg) {
			if (guildcfg.customPrefix != null) {
				if (msg.content.toLowerCase().startsWith(guildcfg.customPrefix)) {
					prefixLength = guildcfg.customPrefix.length;
				}
			}
		}
		if (!guildcfg) {
			if (prefixLength !== 0) return;
			if (msg.content.toLowerCase().startsWith(prefix)) {
				prefixLength = prefix.length;
			}
		}
		if (msg.content.startsWith(`<@${bot.user.id}>`)) {
			if (prefixLength !== 0) return;
			prefixLength = 3 + bot.user.id.length;
		}
		// if() prefixLength = 0;
		return prefixLength;
	}
	const prefixLength = prefixConfig(guildConfig);
	if (msg.content.length == prefixLength || prefixLength == 0) return;
	// Loads the default prefix set in config.json, then loads the customPrefix (if set) and allows users to use the bot by mentioning it.
	const [cmdName, ...args] = msg.content.slice(prefixLength).split(" ").map(s => s.trim())
		.filter(s => !!s);
	const command = bot.commands.find(({
		id,
		aliases,
	}) => id === cmdName.toLowerCase() || aliases.includes(cmdName.toLowerCase()));
	if (!command) return;

	// Command logging - logs to the console.
	const d = new Date(msg.timestamp);
	const date = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
	const author = `${bot.tag(msg.author)} (${msg.author.id})`;
	const guild = `${msg.channel.guild.name}:${msg.channel.guild.id}`;
	let argumentStr = "";

	if (args.length > 0) {
		argumentStr = `Args: ${ch.bold(args.join(" "))}`;
	}
	console.log(`${ch.blue(`[${date}]:`)} by ${ch.bold(author)} in ${ch.bold(guild)} Command: ${ch.bold(cmdName)} ${argumentStr}`);
	const [blacklist] = await db.table("blacklist").filter({
		user: msg.author.id,
	});

	// Prevents blacklisted users from doing anything
	if (blacklist) {
		return;
	}

	// Checks if a command is disabled
	if (guildConfig && (guildConfig.disabledCmds || []).includes(cmdName)) {
		msg.channel.createMessage({
			embed: {
				title: `Error!`,
				description: `This command has been disabled in this server.`,
				color: 0xff7777,
				timestamp: new Date(),
			},
		});
		return;
	}
	// Checks if the user has permissions to run the command.
	if (!bot.canRunCommand(command, {
		member: msg.member,
		channel: msg.channel,
	})) {
		if (command.category === CommandCategories.NSFW) {
			await msg.channel.createMessage({
				embed: {
					title: `Error!`,
					description: `This is not a NSFW channel.`,
					color: 0xff7777,
					timestamp: new Date(),
				},
			});
		} else {
			await msg.channel.createMessage({
				embed: {
					title: `Error!`,
					description: `You do not have permission to run this command.`,
					color: 0xff7777,
					timestamp: new Date(),
					footer: {
						text: `${command.requiredPerms ? `You need the permission ${command.requiredPerms}.` : "\u200b"}`,
					},
				},
			});
		}
		return;
	}
	try {
		await command.run(msg, args);
	} catch (e) {
		// Attempts to post the error the bot came across in chat.
		Raven.captureException(e);
		console.error(e);
		if (e.size > 2000) {
			console.log(e);
			msg.channel.createMessage({
				embed: {
					title: `Error!`,
					description: `The error message was over 2000 characters long.`,
					color: 0xff7777,
					timestamp: new Date(),
				},
			});
		}
		msg.channel.createMessage({
			embed: {
				title: `Error!`,
				description: e.message,
				color: 0xff7777,
				timestamp: new Date(),
			},
		});
	}
});


require("./logging")(bot, db);
bot.connect();
