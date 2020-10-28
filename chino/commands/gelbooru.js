const {
	get,
} = require("snekfetch");
const Command = require("../lib/Command");
const {
	CommandCategories,
} = require("../lib/Constants");
class gelbooruCommand extends Command {
	constructor(...args) {
		super(...args, {
			category: CommandCategories.NSFW,
			description: "Posts an image from Gelbooru.",
			aliases: ["gel", "gb"],
			allowdisable: true,
		});
	}

	async run(msg, args) {
		// Checks if the channel is NSFW.
		if (msg.channel.nsfw) {
			if (!args[0]) {
				var {
					body,
				// Gets the Gelbooru API.
				} = await get("https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1");
			} else {
				var {

					body,

				// Gets the Gelbooru API that allows tags.
				} = await get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=100&tags=${args.join("%20")}`);
			}
			if (body.size == 0) {
				msg.channel.createMessage({
					embed: this.errembed({
						title: `Error!`,
						description: `404 Not Found`,
					}),
				});
			}
			// Gets a random image when run without args, else post the image requested.
			const random = Math.floor(Math.random() * 99) + 1;
			if (body.toString("utf8").length != 0 && typeof body[random] != "undefined") {
				await msg.channel.createMessage({
					embed: {
						color: 0x7289DA,
						image: {
							url: body[random].file_url,
						},
					},
				});
			} else {
				msg.channel.createMessage({
					embed: this.errembed({
						title: `Error!`,
						description: `No results found.`,
					}),
				});
			}
		} else {
			await await msg.channel.createMessage({
				embed: this.errembed({
					title: "Error!",
					description: `This is not a NSFW channel.`,
				}),
			});
		}
	}
}

module.exports = gelbooruCommand;
