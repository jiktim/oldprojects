const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class pollCommand extends Command {
	constructor(...args) {
		super(...args, {
			usage: "<text> <image url> --title \"title\" [--color <hex>, --noimage,--authorimg <url>]",
			category: CommandCategories.MISC,
			description: "Creates a poll that users can vote on.",
			requiredPerms: "manageMessages",
			aliases: ["createpoll", "create_poll"],
			allowdisable: true,
		});
	}
	// Custom arguments for the poll command.
	async run(msg, args) {
		if (args.length > 0) {
			const color = args.indexOf("--color");
			const noimage = args.indexOf("--noimage");
			const title = args.indexOf("--title");
			const image = args.indexOf("--image");
			const authorimg = args.indexOf("--authorimg");

			let description = "";
			if (color != -1) description = args.join(" ").substring(0, args.join(" ").indexOf("--color")).replace("--noimage", "");
			if (title != -1) description = args.join(" ").substring(0, args.join(" ").indexOf("--title")).replace("--noimage", "");
			if (color == -1 && title == -1) description = args.join(" ");
			description = description.replace(/--image/g, "").replace(/--authorimg/g, "");

			// Finds the title for the embed.
			function findTitle() {
				let quotes = [];
				let index = 0;
				if (args[title + 1].charAt(0) == "\"") {
					args.join(" ").split("").forEach(o => {
						index++;
						if (o == "\"") {
							quotes.push(index - o.length);
						}
					});
				}
				if (quotes[0], quotes[1]) return args.join(" ").substring(quotes[0] + 1, quotes[1]);
				else return undefined;
			}

			// Finds the colour for the embed.
			function findColor() {
				if (args[color + 1]) return args[color + 1].replace("#", "0x");
				else return 0x7289DA;
			}
			// Sends the embed.
			let embedConstruct = {};
			if (noimage == -1) {
				const urlCheck = msg.content.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g);
				if (urlCheck || msg.attachments[0]) {
					description = description.replace(urlCheck[0], "");
					if (authorimg != -1) {
						embedConstruct.author = {
							name: findTitle() || msg.author.username,
							icon_url: urlCheck.length > 0 ? urlCheck[0] : msg.attachments[0].url,
						};
					} else if (image != -1) {
						embedConstruct.image = {
							url: urlCheck.length > 0 ? urlCheck[0] : msg.attachments[0].url,
						};
					} else {
						embedConstruct.thumbnail = {
							url: urlCheck.length > 0 ? urlCheck[0] : msg.attachments[0].url,
						};
					}
				} else {
					embedConstruct.thumbnail = {
						url: msg.author.dynamicAvatarURL(null, 512),
					};
				}
			}
			if (description) embedConstruct.description = description;
			embedConstruct.color = parseInt(findColor()) || 0x7289DA;
			if (authorimg == -1) embedConstruct.title = findTitle() || msg.author.username;
			try {
				const pollmessage = await msg.channel.createMessage({
					embed: embedConstruct,
				});
				pollmessage.addReaction("👍");
				pollmessage.addReaction("👎");
			} catch (e) {
				msg.channel.createMessage({
					embed: this.embed({
						title: "Error!",
						description: "I couldn't create the poll.",
					}),
				});
			}
		} else {
			// If no text is given
			msg.channel.createMessage({
				embed: this.embed({
					title: "Poll",
					description: "To create a poll, type -poll <text>. For more info, type -help poll.",
				}),
			});
		}
	}
}

module.exports = pollCommand;
